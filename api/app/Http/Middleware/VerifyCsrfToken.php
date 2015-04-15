<?php namespace App\Http\Middleware;

use Closure;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerifier;

class VerifyCsrfToken extends BaseVerifier {

	/**
	* Determine if the session and input CSRF tokens match.
	*
	* @param  \Illuminate\Http\Request  $request
	* @return bool
	*/
	protected function tokensMatch($request)
	{
			$csrf = App::make('App\Vault\Security\Csrf');

			return $csrf->isRequestValid($request);
	}
	/**
	* Add the CSRF token to the response cookies.
	*
	* @param  \Illuminate\Http\Request  $request
	* @param  \Illuminate\Http\Response  $response
	* @return \Illuminate\Http\Response
	*/
	protected function addCookieToResponse($request, $response)
	{
	//	$response->headers->setCookie(
	//		new Cookie('XSRF-TOKEN', $request->session()->token(), time() + 60 * 120, '/', null, false, false)
	//	);
			App::make('Vault\Security\Csrf')->createCsfrCookie();

			return $response;
	}


}
