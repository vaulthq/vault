<?php namespace App\Http\Controllers;

use App\Events\User\UserCreated;
use App\Events\User\UserDeleted;
use App\Http\Requests\AdminOnlyRequest;
use App\Http\Requests\UserCreateRequest;
use App\Vault\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Input;

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
        $model = User::create(Input::all());
        $model->password = Hash::make($request->get('password'));
        $model->save();

        event(new UserCreated($model));

        return $model;
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function update()
    {
        $data = json_decode(file_get_contents("php://input", "r"));

        $model = User::findOrFail($data->id);

        $model->email = $data->email;
        $model->name = $data->name;
        $model->surname = $data->surname;

        if (isset($data->group) && $model->group != $data->group && $model->group == User::GROUP_ADMIN) {
            if ($this->isLastAdmin($model)) {
                return Response::make('You cannot change this user group.', 419);
            }
            $model->group = $data->group;
        }

        History::make('user', 'Updated user details.', $model->id);

        if (isset($data->password)) {
            History::make('user', 'Changed user password.', $model->id);
            $model->password = Hash::make($data->password);
        }

        $model->save();
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

    private function isLastAdmin(User $user)
    {
        $adminCount = DB::table('user')
            ->where('id', '<>', $user->id)
            ->where('group', User::GROUP_ADMIN)
            ->whereNull('deleted_at')
            ->count();

        return $adminCount <= 0;
    }
}
