<?php
App::before(function($request)
{
	//
});


App::after(function($request, $response)
{
	//
});


Route::filter('auth', function()
{
	if (Auth::guest()) return Redirect::guest('login');
});

Route::filter('ngauth', function()
{
    if (Auth::guest()) {
        return Response::json(['flash' => 'Session expired.'], 401);
    }
});

Route::filter('admin', function()
{
    if (Auth::user()->group != User::GROUP_ADMIN) {
        return Response::json(['flash' => 'You cannot access this resource.'], 403);
    }
});

Route::filter('auth.basic', function()
{
	return Auth::basic();
});

/*
|--------------------------------------------------------------------------
| Guest Filter
|--------------------------------------------------------------------------
|
| The "guest" filter is the counterpart of the authentication filters as
| it simply checks that the current user is not logged in. A redirect
| response will be issued if they are, which you may freely change.
|
*/

Route::filter('guest', function()
{
	if (Auth::check()) return Redirect::to('/');
});

Route::filter('ngcsrf', function($route, $request)
{
    $csrf = App::make('Vault\Security\Csrf');

    if (!$csrf->isRequestValid($request)) {
        return Response::json(['flash' => 'Session token expired.'], 420);
    }
});

/*
|--------------------------------------------------------------------------
| CSRF Protection Filter
|--------------------------------------------------------------------------
|
| The CSRF filter is responsible for protecting your application against
| cross-site request forgery attacks. If this special token in a user
| session does not match the one given in this request, we'll bail.
|
*/

Route::filter('csrf', function()
{
	if (Session::token() != Input::get('_token'))
	{
		throw new Illuminate\Session\TokenMismatchException;
	}
});