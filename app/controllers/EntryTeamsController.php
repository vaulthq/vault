<?php

class EntryTeamsController extends \BaseController {

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
            'team_id' => Input::get('team_id'),
            'project_id' => Input::get('entry_id')
        ], EntryTeam::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $entry = Entry::findOrFail(Input::get('entry_id'));
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $model = new EntryTeam();
        $model->user_by_id = Auth::user()->id;
        $model->entry_id = Input::get('entry_id');
        $model->team_id = Input::get('team_id');
        $model->save();

        History::make('share', 'Added team to entry ('.$entry->name.').', $model->id);

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
        return EntryTeam::where('entry_id', $id)->get();
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
        $model = EntryTeam::findOrFail($id);

        $entry = Entry::findOrFail($model->entry_id);
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make('entry', 'Removed team from entry.', $id);

        $model->delete();
	}


}
