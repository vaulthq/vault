<?php

Route::get('/', function()
{
    $existing = Cookie::get('XSRF-TOKEN');
    if (is_null($existing)) {
        $value = md5(Session::token());
        setcookie('XSRF-TOKEN', $value, time()+3600, '/', null, false, 0);
    }
	return View::make('angular');
});
//'before' => 'ngcsrf'
Route::group([], function() {
    Route::group(['prefix' => 'internal'], function() {
        Route::controller('auth', 'AuthController');
    });
//'before' => 'ngauth'
    Route::group(array('prefix' => 'api', ), function() {
        Route::get('project/keys/{id}', ['as' => 'keys', 'uses' => 'ProjectController@getKeys']);
        Route::resource('user', 'UserController');
        Route::resource('project', 'ProjectController');
        Route::get('entry/password/{id}', ['as' => 'password', 'uses' => 'EntryController@getPassword']);
        Route::resource('entry', 'EntryController');
        Route::resource('recent', 'RecentController');
    });
});


