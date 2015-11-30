<?php namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel {

	/**
	 * The application's global HTTP middleware stack.
	 *
	 * @var array
	 */
	protected $middleware = [
		'Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode'
	];

	/**
	 * The application's route middleware.
	 *
	 * @var array
	 */
	protected $routeMiddleware = [
		'jwt.auth' => 'Tymon\JWTAuth\Middleware\GetUserFromToken',
		'jwt.refresh' => 'Tymon\JWTAuth\Middleware\RefreshToken',
		'api.key' => 'App\Http\Middleware\ApiKeyMiddleware',
		'admin' => 'App\Http\Middleware\AdminMiddleware',
	];

}
