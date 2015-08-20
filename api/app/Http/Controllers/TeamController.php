<?php namespace App\Http\Controllers;

use App\Vault\Models\Team;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class TeamController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Team::with('owner', 'users')->get();
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
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

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return Team::with('owner', 'users')->where('id', $id)->get()->first();
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 */
	public function update($id)
	{
        $data = json_decode(file_get_contents("php://input", "r"));

        $validator = Validator::make(['name' => isset($data->name) ? $data->name : ''], Team::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $model = Team::findOrFail($data->id);

        $model->name = $data->name;

		if (!$model->save()) {
			abort(403);
		}
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 */
	public function destroy($id)
	{
        $model = Team::findOrFail($id);

        if (!$model->delete()) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }
	}


}
