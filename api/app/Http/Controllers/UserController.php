<?php namespace App\Http\Controllers;

use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Vault\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(UserCreateRequest $request)
    {
        return $this->dispatchFrom('App\Jobs\UserCreateCommand', $request);
    }

    public function show(User $model)
    {
        return $model;
    }

    public function update(UserUpdateRequest $request)
    {
        $this->dispatchFrom('App\Jobs\UserUpdateCommand', $request);
    }
}
