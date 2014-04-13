<?php
class UserController extends \BaseController
{
/*index
create
store
show
edit
update
destroy*/

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

        if (isset($data->password)) {
            $model->password = Hash::make($data->password);
        }

        $model->save();
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
    }
}