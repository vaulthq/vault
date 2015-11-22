<?php namespace App\Vault\Encryption;

use App\Vault\Models\Entry;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Collection;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Crypt;
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
        //@todo check if user can actually do this
        $users = $this->accessDecider->getUserListForEntry($entry);
        $keys = $this->getUserPublicKeys($users);

        if ($backupKey = $this->getBackupKey()) {
            $keys[] = $backupKey;
        }

        $encrypt = $this->sealer->seal($data, $keys);

        $this->db->connection()->beginTransaction();
        try {
            if ($entry->exists) {
                $entry->keyShares()->delete();
            } else {
                $entry->save();
            }

            $entry->data = $encrypt['sealed'];

            foreach ($users->values() as $id => $user) {
                $entry->keyShares()->create(['user_id' => $user->id, 'public' => $encrypt['keys'][$id]]);
            }

            if ($backupKey) {
                $entry->keyShares()->create(['public' => end($encrypt['keys'])]);
            }

            $entry->save();

            $this->db->connection()->commit();
        } catch (\Exception $e) {
            $this->db->connection()->rollBack();
            throw $e;
        }
    }

    public function decrypt(Entry $entry)
    {
        $user = $this->auth->toUser();
        $share = $entry->keyShares()->where('user_id', $user->id)->firstOrFail();
        $code = Crypt::decrypt($this->auth->getPayload()->get('code'));

        $key = new PrivateKey($user->rsaKey->private);
        $key->unlock($code);

        return $this->sealer->unseal($entry->data, $share->public, $key);
    }

    public function reencrypt(Entry $entry)
    {
        $this->encrypt($this->decrypt($entry), $entry);
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