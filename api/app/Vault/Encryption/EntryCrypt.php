<?php namespace App\Vault\Encryption;

use App\Vault\Models\Entry;
use App\Vault\Models\KeyShare;
use Illuminate\Support\Collection;
use Illuminate\Database\DatabaseManager;

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

    public function __construct(AccessDecider $accessDecider, Sealer $sealer, DatabaseManager $db)
    {
        $this->accessDecider = $accessDecider;
        $this->sealer = $sealer;
        $this->db = $db;
    }

    public function encrypt($data, Entry $entry)
    {
        //@todo check if user can actually do this
        $users = $this->accessDecider->getUserListForEntry($entry);
        $keys = $this->getUserPublicKeys($users);
        $encrypt = $this->sealer->seal($data, $keys);

        $entry->data = $encrypt['sealed'];

        $shares = [];
        foreach ($users as $id => $user) {
            $share = new KeyShare();
            $share->user_id = $user->id;
            $share->public = $encrypt['keys'][$id];
            $shares[] = $share;
        }

        $this->db->connection()->beginTransaction();
        try {
            if ($entry->exists) {
                $this->db->table('key_share')->where('entry_id', $entry->id)->delete();
            } else {
                $entry->save();
            }

            $entry->shares()->saveMany($shares);
            $entry->save();

            $this->db->connection()->commit();
        } catch (\Exception $e) {
            $this->db->connection()->rollBack();
            throw $e;
        }
    }

    public function decrypt(Entry $entry, $share, PrivateKey $key)
    {
        return $this->sealer->unseal($entry->data, $share, $key);
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