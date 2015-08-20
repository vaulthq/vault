<?php namespace App\Listeners\Events;

use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserLoggedOut;

use App\Vault\Logging\HistoryLogger;

class AuthHistoryLogger
{
	/**
	 * @var HistoryLogger
	 */
	private $logger;

	/**
	 * @param HistoryLogger $logger
	 */
	public function __construct(HistoryLogger $logger)
	{
		$this->logger = $logger;
	}

	public function onUserLogin(UserLoggedIn $event)
	{
		$this->logger->log('auth', $event->getUser()->email . ' logged in.');
	}

	public function onUserLogout(UserLoggedOut $event)
	{
		$this->logger->log('auth', $event->getUser()->email . ' logged out.');
	}

	public function subscribe($events)
	{
		$events->listen('App\Events\Auth\UserLoggedIn', 'App\Listeners\Events\AuthHistoryLogger@onUserLogin');
		$events->listen('App\Events\Auth\UserLoggedOut', 'App\Listeners\Events\AuthHistoryLogger@onUserLogout');
	}

}
