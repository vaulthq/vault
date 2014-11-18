<?php

class ProjectTeamsController extends \BaseController {

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
            'project_id' => Input::get('project_id')
        ], ProjectTeam::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $entry = Project::findOrFail(Input::get('project_id'));
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $model = new ProjectTeam();
        $model->user_by_id = Auth::user()->id;
        $model->project_id = Input::get('project_id');
        $model->team_id = Input::get('team_id');
        $model->save();

        History::make('share', 'Added team to project ('.$entry->name.').', $model->id);

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
        return ProjectTeam::where('project_id', $id)->get();
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
        $model = ProjectTeam::findOrFail($id);

        $project = Project::findOrFail($model->project_id);
        if (!$project->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make('entry', 'Removed team from project.', $id);

        $model->delete();
	}


}
