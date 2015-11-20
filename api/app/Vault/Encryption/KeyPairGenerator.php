<?php namespace App\Vault\Encryption;

class KeyPairGenerator
{
    public static function generate($passphrase)
    {
        $private = null;
        $resource = openssl_pkey_new([
            'private_key_bits' => 2048
        ]);

        openssl_pkey_export($resource, $private, $passphrase);

        $keyDetails = openssl_pkey_get_details($resource);
        $public = $keyDetails["key"];

        return [
            'private' => $private,
            'public' => $public,
        ];
    }
}
