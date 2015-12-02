<?php namespace App\Vault\Security;

use App\Vault\Encryption\PrivateKey;
use App\Vault\Exception\InvalidAuthException;
use App\Vault\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class ApiKey
{
    public function extractKeyAndUser(Request $request)
    {
        $apiKey = $request->header('Authorization');

        if (!$apiKey) {
            throw new InvalidAuthException('No Authorization header provided.');
        }

        if (strpos($apiKey, 'Basic ') === 0) {
            $apiKey = substr($apiKey, 5, strlen($apiKey));
        }

        $parts = explode(':', $apiKey);

        if (sizeof($parts) != 2) {
            throw new InvalidAuthException('Invalid Authorization header provided. It has to be user:code');
        }

        $user = User::where('email', trim($parts[0]))->first();

        if ($user) {
            try {
                $key = new PrivateKey($user->rsaKey->private);
                $pass = Crypt::decrypt(trim($parts[1]));
                $key->unlock($pass);

                return [
                    'user' => $user,
                    'key' => $key
                ];
            } catch (\Exception $e) {
                throw new InvalidAuthException($e->getMessage());
            }
        }

        return null;
    }
}
