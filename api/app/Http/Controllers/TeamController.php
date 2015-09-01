<?php namespace App\Http\Controllers;

use App\Vault\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class TeamController extends Controller
{
	public function index()
	{
		return Team::with('owner', 'users')->get();
	}

	public function store()
	{
        $validator = Validator::make(Input::all(), Team::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $model = new Team();
        $model->name = Input::get('name');
        $model->user_id = Auth::user()->id;
        $model->save();

        return Team::with('owner', 'users')->where('id', $model->id)->get()->first();
	}

	public function show(Team $team)
	{
		$team->load('owner', 'users');

		return $team;
	}

	public function update(Team $model, Request $request)
	{
        $validator = Validator::make(['name' => $request->get('name')], Team::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $model->name = $request->get('name');

		if (!$model->save()) {
			abort(403);
		}
	}

	public function destroy(Team $model)
	{
        if (!$model->delete()) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }
	}


}
