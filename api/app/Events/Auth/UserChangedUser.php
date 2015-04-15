<?php namespace App\Events\Auth;

use App\Events\Event;
use App\Vault\Models\User;
use Illuminate\Queue\SerializesModels;

class UserChangedUser extends Event
{
	use SerializesModels;

	/**
	 * @var User
	 */
	private $user;
	/**
	 * @var User
	 */
	private $userTo;

	/**
	 * @param User $user
	 * @param User $userTo
	 */
	public function __construct(User $user, User $userTo)
	{
		$this->user = $user;
		$this->userTo = $userTo;
	}

	/**
	 * @return User
	 */
	public function getUser()
	{
		return $this->user;
	}

	/**
	 * @return User
	 */
	public function getUserTo()
	{
		return $this->userTo;
	}
}
