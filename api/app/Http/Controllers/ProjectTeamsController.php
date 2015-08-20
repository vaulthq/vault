<?php namespace App\Http\Controllers;

use App\Vault\Models\History;
use App\Vault\Models\Project;
use App\Vault\Models\ProjectTeam;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class ProjectTeamsController extends Controller
{
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

        $model = new ProjectTeam();
        $model->user_by_id = Auth::user()->id;
        $model->project_id = Input::get('project_id');
        $model->team_id = Input::get('team_id');

        if (!$model->save()) {
            abort(403);
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
	public function destroy($id)
	{
        $model = ProjectTeam::findOrFail($id);

        if (!$model->delete()) {
            abort(403);
        }
	}
}
