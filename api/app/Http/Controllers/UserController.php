<?php namespace App\Http\Controllers;

use App\Events\User\UserDeleted;
use App\Http\Requests\AdminOnlyRequest;
use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Vault\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Input;

class UserController extends Controller
{
    public function __construct()
    {
     /*   $this->beforeFilter('admin', [
            'only' => ['update', 'destroy']
        ]);*/
    }

    public function index()
    {
        return User::all();
    }

    public function store(UserCreateRequest $request)
    {
        return $this->dispatchFrom('App\Commands\UserCreateCommand', $request);
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function update(UserUpdateRequest $request)
    {
        $this->dispatchFrom('App\Commands\UserUpdateCommand', $request);
    }

    public function destroy(User $user, AdminOnlyRequest $request)
    {
        if ($this->isLastAdmin($user)) {
            abort(403);
        }

        event(new UserDeleted($user));
/*

//@todo move to events

        foreach (Entry::where('user_id', $model->id)->get() as $item) {
            $item->user_id = Auth::user()->id;
            $item->save();
            History::make('reassign', 'Assigning entry #'.$item->id.'.', $item->id);
        }

        foreach (Team::where('user_id', $model->id)->get() as $item) {
            $item->user_id = Auth::user()->id;
            $item->save();
            History::make('reassign', 'Assigning team #'.$item->id.'.', $item->id);
        }

        $model->delete();*/
    }


}
