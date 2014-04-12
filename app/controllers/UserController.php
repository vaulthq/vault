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
            return Response::json($validator->messages(), 201);
        }

        $model = User::create(Input::all());
        $model->password = Hash::make(Input::get('password'));
        $model->save();
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
    }
}