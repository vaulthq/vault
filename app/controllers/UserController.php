<?php

class UserController extends \BaseController
{
	public function getIndex()
	{
		return User::all();
	}


}