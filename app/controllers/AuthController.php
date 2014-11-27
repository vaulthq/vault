<?php
class AuthController extends \BaseController
{
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

        return Response::json([], 419);
    }

    public function getIndex()
    {
        History::make('auth', Auth::user()->email . ' logged out.', null);
        Auth::logout();

        return Response::json([
            'flash' => trans('auth.flash.logout_success')
        ], 200);
    }
}