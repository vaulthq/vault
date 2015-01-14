<?php

Route::get('/', function()
{
    App::make('Vault\Security\Csrf')->createCsfrCookie();

	return View::make('angular');
});

Route::group(['before' => 'ngcsrf'], function() {
    Route::group(['prefix' => 'internal'], function() {
        Route::controller('auth', 'AuthController');
    });

    Route::group(array('prefix' => 'api', 'before' => 'ngauth'), function() {
        Route::get('project/keys/{id}', ['as' => 'keys', 'uses' => 'ProjectController@getKeys']);
        Route::get('project/teams/{id}', ['as' => 'teams', 'uses' => 'ProjectController@getTeams']);
        Route::get('project/changeOwner/{id}', ['as' => 'projectOwner', 'uses' => 'ProjectController@changeOwner']);
        Route::resource('project', 'ProjectController');

        Route::resource('profile', 'ProfileController');
        Route::resource('user', 'UserController');
        Route::resource('recent', 'RecentController');
        Route::resource('share', 'ShareController');
        Route::resource('team', 'TeamController');
        Route::resource('teamMembers', 'TeamMembersController');
        Route::resource('projectTeams', 'ProjectTeamsController');

        Route::get('entry/password/{id}', ['as' => 'password', 'uses' => 'EntryController@getPassword']);
        Route::get('entry/download/{id}', ['as' => 'download', 'uses' => 'EntryController@getDownload']);
        Route::get('entry/access/{id}', ['as' => 'access', 'uses' => 'EntryController@getAccess']);
        Route::resource('entry', 'EntryController');

        Route::group(['before' => 'admin'], function() {
            Route::resource('history', 'HistoryController');
        });
    });
});


