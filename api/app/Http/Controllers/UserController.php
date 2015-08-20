<?php namespace App\Http\Controllers;

use App\Events\User\UserDeleted;
use App\Http\Requests\AdminOnlyRequest;
use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Vault\Models\Entry;
use App\Vault\Models\History;
use App\Vault\Models\Team;
use App\Vault\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct()
    {
        $this->beforeFilter('admin', [
            'only' => ['update', 'destroy']
        ]);
    }

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

    public function destroy(User $user, AdminOnlyRequest $request)
    {
        $this->dispatchFrom('App\Jobs\UserDeleteCommand', $request, [
            'id' => $user->id
        ]);
    }
}
