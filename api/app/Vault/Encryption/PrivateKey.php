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
    private $resource = false;

    public function __construct($key)
    {
        $this->key = $key;
    }

    /**
     * @param string $passphrase md5 of user passphrase
     * @return $this
     */
    public function unlock($passphrase)
    {
        if ($this->resource) {
            throw new \RuntimeException('This key already been unlocked!');
        }

        $this->resource = openssl_pkey_get_private($this->key, $passphrase);

        if ($this->resource === false) {
            throw new \RuntimeException("Loading private key failed: " . openssl_error_string());
        }

        return $this;
    }

    public function getResource()
    {
        return $this->resource;
    }

    public function getKey()
    {
        return $this->key;
    }

    public function lock($passphrase)
    {
        if ($this->resource === false) {
            throw new \RuntimeException("Key is still locked.");
        }

        openssl_pkey_export($this->resource, $this->key, md5($passphrase));

        return $this;
    }
}
