<?php
class AuthController extends \BaseController
{
    public function postIndex()
    {
        $credentials = [
            'email' => Input::get('email'),
            'password' => Input::get('password')
        ];

        if (Auth::attempt($credentials)) {
            History::make('auth', Auth::user()->email . ' logged in.', null);
            return Response::json([
                'user' => Auth::user()->toArray(),
            ], 202);
        }

        return Response::json([
            'flash' => trans('auth.flash.bad_credentials')
        ], 401);
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