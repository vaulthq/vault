<?php
class ProjectController extends \BaseController
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
	 * @return Response
	 */
	public function store()
	{
        $validator = Validator::make(Input::all(), Project::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $model = new Project();
        $model->name = Input::get('name');
        $model->description = Input::get('description');
        $model->user_id = Auth::user()->id;

        $model->save();

        History::make('project', 'Created new project.', $model->id);

        return $model;
	}

    /**
     * Return list of keys which belong to project
     *
     * @param $id
     * @return mixed
     */
    public function getKeys($id)
    {
        return Entry::where('project_id', $id)->get();
    }

    public function getTeams($id)
    {
        $project = Project::findOrFail($id);

        return $project->teams()->with('owner', 'users')->get();
    }

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
        return Project::findOrFail($id);
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

        $validator = Validator::make(['name' => isset($data->name) ? $data->name : ''], Project::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $model = Project::findOrFail($data->id);

        if (!$model->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $model->name = $data->name;
        $model->description = $data->description;

        History::make('project', 'Updated project details.', $model->id);

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
        $model = Project::findOrFail($id);

        if (!$model->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make('project', 'Deleted project #' . $id . ' ('.$model->name.').', $id);

        $model->delete();
	}

    public function changeOwner($id)
    {
        $project = Project::findOrFail($id);
        $newOwner = User::findOrFail(Input::get('owner'));
        $recursive = Input::get('assign', false);

        if (!$project->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make(
            'project-owner',
            'Changed owner from "'. $project->user_id .'" to "'. $newOwner->id .'"' . ($recursive ? ' (recursive)' : ''),
            $id
        );

        if ($recursive) {
            foreach ($project->keys as $key) {
                if ($key->user_id == $project->user_id) {
                    History::make('entry-owner', 'Changed entry owner from "'. $key->user_id .'" to "'. $newOwner->id .'"', $key->id);

                    $key->user_id = $newOwner->id;

                    $key->save();
                }
            }
        }

        $project->user_id = $newOwner->id;
        $project->save();
    }
}
