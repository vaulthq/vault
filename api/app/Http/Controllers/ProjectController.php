<?php namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Vault\Models\Entry;
use App\Vault\Models\Project;
use App\Vault\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;

class ProjectController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Project::all();
	}

    /**
     * Show the form for creating a new resource.
     *
     * @param ProjectRequest $request
     * @return Response
     */
	public function store(ProjectRequest $request)
	{
        $model = new Project();
        $model->name = $request->get('name');
        $model->description = $request->get('description', '');
        $model->user_id = Auth::user()->id;

        $model->save();

        return $model;
	}

    /**
     * Return list of keys which belong to project
     *
     * @param Project $model
     * @return mixed
     */
    public function getKeys(Project $model)
    {
        return Entry::with('tags')->where('entry.project_id', $model->id)->get();
    }

    public function getTeams(Project $model)
    {
        return $model->teams()->with('owner', 'users')->get();
    }

    /**
     * Display the specified resource.
     *
     * @param Project $model
     * @return Response
     */
	public function show(Project $model)
	{
        return $model;
	}

    /**
     * Update the specified resource in storage.
     *
     * @param Project $model
     * @param ProjectRequest $request
     * @return Response
     */
	public function update(Project $model, ProjectRequest $request)
	{
        $model->name = $request->get('name');
        $model->description = $request->get('description', '');

        if (!$model->save()) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }
	}

    /**
     * Remove the specified resource from storage.
     *
     * @param Project $model
     * @return Response
     */
	public function destroy(Project $model)
	{
        if (!$model->delete()) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }
	}

    public function changeOwner(Project $project)
    {
        $newOwner = User::findOrFail(Input::get('owner'));
        $recursive = Input::get('assign', false);

        if (!$project->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        if ($recursive) {
            foreach ($project->keys as $key) {
                if ($key->user_id == $project->user_id) {
                    $key->user_id = $newOwner->id;
                    $key->save();
                }
            }
        }

        $project->user_id = $newOwner->id;

        if (!$project->save()) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }
    }
}
