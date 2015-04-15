<?php namespace App\Events\Auth;

use App\Vault\Models\User;

class UserChangedUser extends AuthEvent
{
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
		$this->userTo = $userTo;

		parent::__construct($user);
	}

	/**
	 * @return User
	 */
	public function getUserTo()
	{
		return $this->userTo;
	}
}
