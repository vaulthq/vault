<?php
class UserController extends \BaseController
{
    public function index()
    {
        return User::all();
    }

    public function store()
    {
        $validator = Validator::make(Input::all(), User::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $model = User::create(Input::all());
        $model->password = Hash::make(Input::get('password'));
        $model->save();

        History::make('user', 'Created new user. (' . $model->email . ', ' . User::$groups[$model->group] . ').', $model->id);

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
        $model->group = $data->group;

        History::make('user', 'Updated user details.', $model->id);

        if (isset($data->password)) {
            History::make('user', 'Changed user password.', $model->id);
            $model->password = Hash::make($data->password);
        }

        $model->save();
    }

    public function destroy($id)
    {
        $model = User::findOrFail($id);

        History::make('user', 'Deleted user #' . $id . ' ('.$model->email.').', $id);

        $model->delete();
    }
}