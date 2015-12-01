<?php namespace App\Vault\Encryption;

use App\Vault\Models\Entry;
use App\Vault\Models\KeyShare;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Collection;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\JWTAuth;

class EntryCrypt
{
    /**
     * @var AccessDecider
     */
    private $accessDecider;

    /**
     * @var Sealer
     */
    private $sealer;

    /**
     * @var DatabaseManager
     */
    private $db;

    /**
     * @var JWTAuth
     */
    private $auth;

    /**
     * @var Filesystem
     */
    private $fs;

    /**
     * @var bool|string|null
     */
    private $backupKey = false;

    public function __construct(
        AccessDecider $accessDecider,
        Sealer $sealer,
        DatabaseManager $db,
        JWTAuth $auth,
        Filesystem $fs
    ) {
        $this->accessDecider = $accessDecider;
        $this->sealer = $sealer;
        $this->db = $db;
        $this->auth = $auth;
        $this->fs = $fs;
    }

    public function encrypt($data, Entry $entry)
    {
        if (!$entry->exists) {
            throw new \RuntimeException('Cannot encrypt unsaved models');
        }

        $users = $this->accessDecider->getUserListForEntry($entry);
        $keys = $this->getUserPublicKeys($users);

        if ($backupKey = $this->getBackupKey()) {
            $keys[] = $backupKey;
        }

        if ($data == '') { // empty strings causes no encryption to be done, therefore skipping shares
            $data = ' ';
        }

        $encrypt = $this->sealer->seal($data, $keys);

        $this->db->connection()->beginTransaction();
        try {
            $current = DB::table('entry')->where('id', $entry->id)->lockForUpdate()->first();

            if ($current->data != $entry->data) {
                throw new \RuntimeException('Multiple threads trying to modify same record!');
            }

            DB::table('key_share')->where('entry_id', $entry->id)->delete();
            DB::table('entry')->where('id', $entry->id)->update(['data' => $encrypt['sealed']]);

            $dates = ['created_at' => date('Y-m-d H:i:s')];

            $shares = [];
            foreach ($users->values() as $id => $user) {
                $shares[] = ['user_id' => $user->id, 'public' => $encrypt['keys'][$id], 'entry_id' => $entry->id] + $dates;
            }

            if ($backupKey) {
                $shares[] = ['public' => end($encrypt['keys']), 'entry_id' => $entry->id, 'user_id' => null] + $dates;
            }

            DB::table('key_share')->insert($shares);

            $this->db->connection()->commit();

            $entry->fill(['data' => $encrypt['sealed']]);
        } catch (\Exception $e) {
            $this->db->connection()->rollBack();
            throw $e;
        }
    }

    public function decrypt(Entry $entry)
    {
        $user = $this->auth->toUser();
        $share = $entry->keyShares()->where('user_id', $user->id)->firstOrFail();

        return $this->sealer->unseal($entry->data, $share->public, $this->unlockPrivateKey($user->rsaKey->private));
    }

    public function reencrypt(Entry $entry)
    {
        $this->encrypt($this->decrypt($entry->fresh(['keyShares'])), $entry);
    }

    /**
     * @param $users
     * @return array
     */
    public function getUserPublicKeys(Collection $users)
    {
        $keys = [];
        foreach ($users as $user) {
            $keys[] = $user->rsaKey->public;
        }

        return $keys;
    }

    private function unlockPrivateKey($privateString)
    {
        $code = Crypt::decrypt($this->auth->getPayload()->get('code'));

        $key = new PrivateKey($privateString);
        $key->unlock($code);

        return $key;
    }

    /**
     * @return null|string
     */
    private function getBackupKey()
    {
        if ($this->backupKey === false) {
            try {
                $this->backupKey = $this->fs->get(config('app.backup_key'));
            } catch (FileNotFoundException $e) {
                $this->backupKey = null;
            }
        }

        return $this->backupKey;
    }

}
