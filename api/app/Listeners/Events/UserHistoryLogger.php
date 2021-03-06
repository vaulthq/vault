<?php namespace App\Listeners\Events;

use App\Events\User\UserCreated;
use App\Events\User\UserDeleted;
use App\Vault\Logging\HistoryLogger;

class UserHistoryLogger
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

	public function onUserCreated(UserCreated $event)
	{
		$user = $event->getUser();
		$this->logger->log('user', 'Created new user. (' . $user->email . ', ' . $user->getGroup() . ').', $user->id);
	}

	public function subscribe($events)
	{
		$events->listen('App\Events\User\UserCreated', 'App\Listeners\Events\UserHistoryLogger@onUserCreated');
	}

}
