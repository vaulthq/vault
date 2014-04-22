<?php

Route::get('/', function()
{
    $existing = Cookie::get('XSRF-TOKEN');
    if (is_null($existing)) {
        $value = md5(Session::token());
        setcookie('XSRF-TOKEN', $value, time()+3600, '/', 'x.project.kalvaitis.eu', true, false);
    }
	return View::make('angular');
});

Route::group(['before' => 'ngcsrf'], function() {
    Route::group(['prefix' => 'internal'], function() {
        Route::controller('auth', 'AuthController');
    });

    Route::group(array('prefix' => 'api', 'before' => 'ngauth'), function() {
        Route::get('project/keys/{id}', ['as' => 'keys', 'uses' => 'ProjectController@getKeys']);
        Route::resource('project', 'ProjectController');

        Route::resource('profile', 'ProfileController');
        Route::resource('user', 'UserController');
        Route::resource('recent', 'RecentController');
        Route::resource('share', 'ShareController');
        Route::resource('unsafe', 'UnsafeController');

        Route::get('entry/password/{id}', ['as' => 'password', 'uses' => 'EntryController@getPassword']);
        Route::get('entry/access/{id}', ['as' => 'access', 'uses' => 'EntryController@getAccess']);
        Route::resource('entry', 'EntryController');

        Route::group(['before' => 'admin'], function() {
            Route::resource('history', 'HistoryController');
        });
    });
});


