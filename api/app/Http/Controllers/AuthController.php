<?php namespace App\Http\Controllers;

use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserLoggedOut;
use App\Vault\Exception\UserDisabledException;
use App\Vault\Models\User;
use App\Vault\Response\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\JWTAuth;
use Tymon\JWTAuth\Providers\Auth\AuthInterface;

class AuthController extends Controller
{
    use JsonResponse;

    public function __construct()
    {
        $this->middleware('jwt.auth', [
            'only' => ['getIndex']
        ]);
    }

    public function postIndex(Request $request, JWTAuth $jwt, AuthInterface $auth)
    {
        $credentials = $request->only('email', 'password');

        try {
            if ($auth->byCredentials($credentials)) {
                if ($auth->user()->group == User::GROUP_DISABLED) {
                    throw new UserDisabledException('Account has been disabled.');
                }

                $extraInfo = [
                    'user' => $auth->user(),
                    'code' => Crypt::encrypt(md5($credentials['password'])),
                ];

                if ($token = $jwt->fromUser($auth->user(), $extraInfo)) {
                    event(new UserLoggedIn($auth->user()));
                    return $this->jsonResponse(['token' => $token]);
                }
            }
        } catch (JWTException $e) {
            return $this->jsonResponse(['Error creating JWT token'], 401);
        } catch (UserDisabledException $e) {
            return $this->jsonResponse([$e->getMessage()], 401);
        }

        return $this->jsonResponse(['Invalid username or password'], 401);
    }

    public function getStatus(JWTAuth $jwt)
    {
        try {
            if ($token = $jwt->getToken()) {
                return $this->jsonResponse(['user' => $jwt->toUser($token)]);
            }
        } catch (TokenBlacklistedException $e) {

        }

        return $this->jsonResponse(null, 405);
    }

    public function getIndex(JWTAuth $jwt)
    {
        if ($token = $jwt->getToken()) {
            event(new UserLoggedOut($jwt->toUser($token)));
            $jwt->invalidate($token);
        }

        return $this->jsonResponse(null);
    }

    public function getRefresh(JWTAuth $jwt)
    {
        try {
            $token = $jwt->refresh($jwt->getToken());
        } catch (JWTException $e) {
            return $this->jsonResponse(null, 401);
        }

        return $this->jsonResponse(['token' => $token]);
    }
}
