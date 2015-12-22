<?php

Route::get('/', function() {
	return View::make('index');
});

Route::group(['prefix' => 'internal'], function() {
	Route::controller('auth', 'AuthController');
});

Route::group(['prefix' => 'api', 'middleware' => 'api.key'], function() {
	Route::get('deployKey', 'DeployKeyController@find');
	Route::get('keyByTag', 'DeployKeyController@findByTag');
});

Route::group(['prefix' => 'api', 'middleware' => ['jwt.auth', 'valid.user']], function() {
	Route::get('project/keys/{project}', ['as' => 'keys', 'uses' => 'ProjectController@getKeys']);
	Route::get('project/teams/{project}', ['as' => 'teams', 'uses' => 'ProjectController@getTeams']);
	Route::resource('project', 'ProjectController');

	Route::resource('profile', 'ProfileController');
	Route::resource('recent', 'RecentController');
	Route::resource('share', 'ShareController');
	Route::resource('teamMembers', 'TeamMembersController');
	Route::resource('projectTeams', 'ProjectTeamsController');

	Route::group(['prefix' => 'team'], function() {
		Route::get('/', 'TeamController@index');
		Route::get('/{team}', 'TeamController@show');
		Route::post('/', 'TeamController@store');
		Route::put('/{team}', 'TeamController@update');
		Route::delete('/{team}', 'TeamController@destroy');
	});

	Route::group(['prefix' => 'entry'], function() {
		Route::get('/access/{entry}', 'EntryController@getAccess');
		Route::get('/password/{entry}', 'EntryController@getPassword');
		Route::get('/by-domain', 'EntryController@getByDomain');
	});

	Route::resource('entry', 'EntryController');
	Route::resource('entryTeams', 'EntryTeamsController');
	Route::resource('entryTags', 'EntryTagController');

	Route::group(['prefix' => 'user'], function() {
		Route::get('/', 'UserController@index');
		Route::get('/{user}', 'UserController@show');

		Route::group(['middleware' => 'admin'], function() {
			Route::post('/', 'UserController@store');
			Route::put('/{user}', 'UserController@update');
		});
	});

	Route::group(['middleware' => 'admin'], function() {
		Route::resource('history', 'HistoryController');
	});
});
