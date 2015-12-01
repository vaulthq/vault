<?php namespace App\Http\Controllers;

use App\Vault\Encryption\EntryCrypt;
use App\Vault\Models\Project;
use App\Vault\Models\ProjectTeam;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class ProjectTeamsController extends Controller
{
	public function store(EntryCrypt $entryCrypt)
	{
        $validator = Validator::make([
            'team_id' => Input::get('team_id'),
            'project_id' => Input::get('project_id')
        ], ProjectTeam::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        if (ProjectTeam::where('team_id', Input::get('team_id'))->where('project_id', Input::get('project_id'))->count() > 0) {
            return Response::make('This team already has access.', 419);
        }

        $project = Project::findOrFail(Input::get('project_id'));

        $model = new ProjectTeam();
        $model->user_by_id = Auth::user()->id;
        $model->project_id = Input::get('project_id');
        $model->team_id = Input::get('team_id');

        if (!$model->save()) {
            abort(403);
        }

		foreach ($project->keys as $key) {
            $entryCrypt->reencrypt($key);
        }

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
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id, EntryCrypt $entryCrypt)
	{
        $model = ProjectTeam::findOrFail($id);
        $project = $model->project;

        if (!$model->delete()) {
            abort(403);
        }

        foreach ($project->keys as $key) {
            $entryCrypt->reencrypt($key);
        }
	}
}
