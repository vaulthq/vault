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
        Auth::logout();

        return Response::json([
            'flash' => trans('auth.flash.logout_success')
        ], 200);
    }
}