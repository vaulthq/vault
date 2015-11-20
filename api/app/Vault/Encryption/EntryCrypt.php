<?php namespace App\Vault\Encryption;

use App\Vault\Models\Entry;

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

    public function __construct(AccessDecider $accessDecider, Sealer $sealer)
    {
        $this->accessDecider = $accessDecider;
        $this->sealer = $sealer;
    }

    public function encrypt($data, Entry $entry)
    {
        $users = $this->accessDecider->getUserListForEntry($entry);

        $keys = [];
        foreach ($users as $user) {
            $keys[] = $user->rsaKey->public;
        }

        return ['users' => $users] + $this->sealer->seal($data, $keys);
    }

    public function decrypt(Entry $entry, $share, PrivateKey $key)
    {
        return $this->sealer->unseal($entry->data, $share, $key);
    }

}