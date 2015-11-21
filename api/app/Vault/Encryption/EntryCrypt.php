<?php namespace App\Vault\Encryption;

use App\Vault\Models\Entry;
use App\Vault\Models\KeyShare;
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

    public function __construct(AccessDecider $accessDecider, Sealer $sealer, DatabaseManager $db, JWTAuth $auth)
    {
        $this->accessDecider = $accessDecider;
        $this->sealer = $sealer;
        $this->db = $db;
        $this->auth = $auth;
    }

    public function encrypt($data, Entry $entry)
    {
        //@todo check if user can actually do this
        $users = $this->accessDecider->getUserListForEntry($entry);
        $keys = $this->getUserPublicKeys($users);

        $encrypt = $this->sealer->seal($data, $keys);

        $entry->data = $encrypt['sealed'];

        $this->db->connection()->beginTransaction();
        try {
            if ($entry->exists) {
                $entry->keyShares()->delete();
            } else {
                $entry->save();
            }

            foreach ($users->values() as $id => $user) {
                $share = new KeyShare();
                $share->user_id = $user->id;
                $share->public = $encrypt['keys'][$id];
                $entry->keyShares()->save($share);
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

}