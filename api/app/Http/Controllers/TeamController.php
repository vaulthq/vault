<?php namespace App\Http\Controllers;

use App\Vault\Models\Team;

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
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
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

        History::make('user', 'Created new team. (' . $model->name. ').', $model->id);

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
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
        $data = json_decode(file_get_contents("php://input", "r"));

        $validator = Validator::make(['name' => isset($data->name) ? $data->name : ''], Team::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $model = Team::findOrFail($data->id);

        if (!$model->can_edit) {
            return Response::json('', 403);
        }

        $model->name = $data->name;

        History::make('project', 'Updated team details.', $model->id);

        $model->save();
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
        $model = Team::findOrFail($id);

        if (!$model->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make('project', 'Deleted team #' . $id . ' ('.$model->name.').', $id);

        $model->delete();
	}


}
