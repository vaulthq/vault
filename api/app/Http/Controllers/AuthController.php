<?php namespace App\Http\Controllers;

use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserLoggedOut;
use App\Vault\Response\JsonResponse;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\JWTAuth;
use Tymon\JWTAuth\Providers\Auth\AuthInterface;

class AuthController extends Controller
{
    use JsonResponse;
    /**
     * @var Guard
     */
    private $guard;

    public function __construct(Guard $guard)
    {
        $this->beforeFilter('admin', [
            'only' => ['getLogin']
        ]);

        $this->beforeFilter('jwt.refresh', [
            'only' => ['getRefresh']
        ]);

        $this->guard = $guard;
    }

    public function postIndex(Request $request, JWTAuth $jwt, AuthInterface $auth)
    {
        $credentials = $request->only('email', 'password');

        try {
            if ($auth->byCredentials($credentials)) {
                if ($token = $jwt->fromUser($auth->user(), ['user' => $auth->user()])) {
                    return $this->jsonResponse(['token' => $token]);
                }
            }
        } catch (JWTException $e) {
            return $this->jsonResponse(['Error creating JWT token'], 401);
        }

        event(new UserLoggedIn($auth->user()));

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
            $jwt->invalidate($jwt->getToken());
            event(new UserLoggedOut($jwt->toUser($token)));
        }

        return $this->jsonResponse(['flash' => trans('auth.flash.logout_success')]);
    }

    public function getRefresh(JWTAuth $jwt)
    {
        $token = $jwt->refresh($jwt->getToken());

        return $this->jsonResponse(['token' => $token]);
    }
}
