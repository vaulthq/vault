<?php
class AuthController extends \BaseController
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
        $credentials = [
            'email'    => Input::get('email'),
            'password' => Input::get('password')
        ];

        if (Auth::attempt($credentials, Input::get('remember'))) {
            History::make('auth', Auth::user()->email . ' logged in.', null);
            return Response::json([
                'user' => Auth::user()->toArray(),
            ], 202);
        }

        return Response::json(['Invalid username or password'], 401);
    }

    public function getStatus()
    {
        if (!Auth::guest()) {
            return Response::json([
                'user' => Auth::user()->toArray(),
            ], 202);
        }

        return Response::json([], 405);
    }

    public function getIndex()
    {
        if (Auth::check()) {
            History::make('auth', Auth::user()->email . ' logged out.', null);
            Auth::logout();
        }

        return Response::json([
            'flash' => trans('auth.flash.logout_success')
        ], 200);
    }

    public function getLogin($id)
    {
        $user = User::findOrFail($id);

        History::make('auth', Auth::user()->email . ' logged in as ' . $user->email . '.', null);

        Auth::login($user);

        return Response::json([
            'user' => Auth::user()->toArray(),
        ], 202);
    }
}
