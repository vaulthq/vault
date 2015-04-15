<?php namespace App\Http\Controllers;

use App\Events\Auth\UserChangedUser;
use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserLoggedOut;
use App\Vault\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;

class AuthController extends Controller
{
    public function __construct()
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
    }

    public function postIndex()
    {
        if (Auth::attempt(Input::only('email', 'password'), Input::get('remember'))) {
            event(new UserLoggedIn(Auth::user()));

            return Response::json(['user' => Auth::user()->toArray()], 202);
        }

        return Response::json(['Invalid username or password'], 401);
    }

    public function getStatus()
    {
        if (Auth::check()) {
            return Response::json(['user' => Auth::user()->toArray()], 202);
        }

        return Response::json([], 405);
    }

    public function getIndex()
    {
        if (Auth::check()) {
            event(new UserLoggedOut(Auth::user()));
            Auth::logout();
        }

        return Response::json(['flash' => trans('auth.flash.logout_success')], 200);
    }

    public function getLogin($id)
    {
        $user = User::findOrFail($id);

        event(new UserChangedUser(Auth::user(), $user));

        Auth::login($user);

        return Response::json(['user' => Auth::user()->toArray()], 202);
    }
}
