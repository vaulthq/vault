<?php namespace App\Http\Controllers;

use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserLoggedOut;
use App\Vault\Response\JsonResponse;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
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
                if ($token = $jwt->fromUser($auth->user(), ['user' => $auth->user()])) {
                    event(new UserLoggedIn($auth->user()));
                    return $this->jsonResponse(['token' => $token]);
                }
            }
        } catch (JWTException $e) {
            return $this->jsonResponse(['Error creating JWT token'], 401);
        }

        return $this->jsonResponse(['Invalid username or password'], 401);
    }

    public function getStatus(JWTAuth $jwt)
    {
        if ($token = $jwt->getToken()) {
            return $this->jsonResponse(['user' => $jwt->toUser($token)]);
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
