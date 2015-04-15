<?php namespace App\Events\Auth;

use App\Events\Event;
use App\Vault\Models\User;
use Illuminate\Queue\SerializesModels;

class UserLoggedIn extends Event
{
	use SerializesModels;

	/**
	 * @var User
	 */
	private $user;

	/**
	 * @param User $user
	 */
	public function __construct(User $user)
	{
		$this->user = $user;
	}

	/**
	 * @return User
	 */
	public function getUser()
	{
		return $this->user;
	}
}
