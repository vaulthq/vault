<?php namespace App\Vault\Encryption;

class PrivateKey
{
    /**
     * @var string
     */
    private $key;

    /**
     * @var resource
     */
    private $resource = null;

    public function __construct($key)
    {
        $this->key = $key;
    }

    public function unlock($passphrase)
    {
        if ($this->resource) {
            throw new \RuntimeException('This key already been unlocked!');
        }

        $this->resource = openssl_pkey_get_private($this->key, $passphrase);

        return $this;
    }

    public function getResource()
    {
        return $this->resource;
    }

    public function getWrapped()
    {
        return $this->key;
    }
}
