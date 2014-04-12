<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
    $existing = Cookie::get('XSRF-TOKEN');
    if (is_null($existing)) {
        $value = md5( Session::token() );
        setcookie('XSRF-TOKEN', $value, time()+3600, '/', null, false, 0);
    }
	return View::make('angular');
});

Route::group(['before' => 'ngcsrf'], function() {
    Route::group(['prefix' => 'internal'], function() {
        Route::controller('auth', 'AuthController');
    });

    Route::group(array('prefix' => 'api', 'before' => 'ngauth'), function() {
        Route::resource('user', 'UserController');
        Route::resource('project', 'ProjectController');
    });
});


