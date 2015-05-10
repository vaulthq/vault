<?php namespace App\Http\Controllers;

use App\Events\Auth\UserChangedUser;
use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserLoggedOut;
use App\Vault\Models\User;
use App\Vault\Response\JsonResponse;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;

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

    public function postIndex(Request $request)
    {
        $guard = $this->guard;

        if ($guard->attempt($request->only('email', 'password'), $request->get('remember'))) {
            /** @var User $user */
            $user = $guard->user();

            event(new UserLoggedIn($user));

            return $this->jsonResponse(['user' => $user]);
        }

        return $this->jsonResponse(['Invalid username or password'], 401);
    }

    public function getStatus()
    {
        if ($this->guard->check()) {
            return $this->jsonResponse(['user' => $this->guard->user()]);
        }

        return $this->jsonResponse(null, 405);
    }

    public function getIndex()
    {
        if ($this->guard->check()) {
            event(new UserLoggedOut($this->guard->user()));
            $this->guard->logout();
        }

        return $this->jsonResponse(['flash' => trans('auth.flash.logout_success')]);
    }

    public function getLogin(User $user)
    {
        event(new UserChangedUser($this->guard->user(), $user));

        $this->guard->login($user);

        return $this->jsonResponse(['user' => $this->guard->user()]);
    }
}
