<?php namespace App\Http\Controllers;

use App\Events\Auth\UserChangedUser;
use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserLoggedOut;
use App\Vault\Models\User;
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
        $this->beforeFilter('ngauth', [
            'only' => ['getLogin']
        ]);
        $this->beforeFilter('ngcsrf', [
            'only' => ['getLogin']
        ]);
        $this->beforeFilter('admin', [
            'only' => ['getLogin']
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

        //event(new UserLoggedIn($user));

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
        //if ($this->guard->check()) {
         //   event(new UserLoggedOut($jwt->toUser()));
            $jwt->invalidate($jwt->getToken());
       // }

        return $this->jsonResponse(['flash' => trans('auth.flash.logout_success')]);
    }

    public function getLogin(User $user)
    {
        event(new UserChangedUser($this->guard->user(), $user));

        $this->guard->login($user);

        return $this->jsonResponse(['user' => $this->guard->user()]);
    }
}
