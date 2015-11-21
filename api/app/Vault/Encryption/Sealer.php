<?php namespace App\Vault\Encryption;

class Sealer
{
    /**
     * @param string $sealed encrypted value, base64 encoded
     * @param string $shareKey share key, base64 encoded
     * @param PrivateKey $private
     * @return null|string
     */
    public function unseal($sealed, $shareKey, PrivateKey $private)
    {
        $unsealed = null;

        if (openssl_open($this->decode($sealed), $unsealed, $this->decode($shareKey), $private->getResource())) {
            return $unsealed;
        }

        throw new \RuntimeException('Cannot unseal: '. openssl_error_string());
    }

    public function seal($data, array $pubKeys)
    {
        $sealed = null;
        $ekeys = [];

        openssl_seal($data, $sealed, $ekeys, $pubKeys);

        array_walk($ekeys, function(&$key) {
            $key = $this->encode($key);
        });

        return [
            'sealed' => $this->encode($sealed),
            'keys' => $ekeys,
        ];
    }

    private function encode($val)
    {
        return base64_encode($val);
    }

    private function decode($val)
    {
        return base64_decode($val);
    }
}
