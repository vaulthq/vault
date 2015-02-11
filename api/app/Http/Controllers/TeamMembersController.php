<?php namespace App\Http\Controllers;

class TeamMembersController extends Controller
{

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		//
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
        $validator = Validator::make([
            'user_id' => Input::get('user_id'),
            'id' => Input::get('id')
        ], UserTeam::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $entry = Team::findOrFail(Input::get('id'));
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $model = new UserTeam();
        $model->user_by_id = Auth::user()->id;
        $model->user_id = Input::get('user_id');
        $model->team_id = Input::get('id');
        $model->save();

        History::make('share', 'Added member to team ('.$entry->name.').', $model->id);

        return $model;
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return UserTeam::where('team_id', $id)->get();
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
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
        $model = UserTeam::findOrFail($id);

        $entry = Team::findOrFail($model->team_id);
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make('entry', 'Deleted team user.', $id);

        $model->delete();
	}


}
