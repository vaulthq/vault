<?php

class EntryController extends \BaseController
{
    /**
     * Create new Entry in database
     *
     * @return Entry
     */
    public function store()
    {
        $model = new Entry();

        $model->name = Input::get('name');
        $model->url = Input::get('url');
        $model->password = Input::get('password');
        $model->note = Input::get('note');
        $model->project_id = Input::get('project_id');
        $model->user_id = Auth::user()->id;

        $model->save();

        History::make('entry', 'Created new entry.', $model->id);

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
		return Entry::findOrFail($id);
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

        $model = Entry::findOrFail($data->id);

        if (!$model->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $model->name = $data->name;
        $model->url = $data->url;
        $model->note = $data->note;

        History::make('entry', 'Updated entry details.', $model->id);

        if (isset($data->password)) {
            History::make('entry_p', 'Updated entry password.', $model->id);

            $model->password = $data->password;
        }

        $model->save();

        return $model;
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
        $model = Entry::findOrFail($id);

        if (!$model->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make('entry', 'Deleted entry #' . $id . ' ('.$model->project->name.').', $id);

        $model->delete();
	}

    /**
     * Get password for Entry
     *
     * @param $id
     * @return mixed
     */
    public function getPassword($id)
    {
        $model = Entry::findOrFail($id);

        if (!$model->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make('password', 'Accessed password #' . $id . ' ('.$model->project->name.').', $id);

        return Response::json(['password' => strlen($model->password) > 0 ? $model->password : ''], 200);
    }

    public function getAccess($id)
    {
        $model = Entry::findOrFail($id);
        $users = [];
        $added = [];

        foreach ($model->shares()->get() as $share) {
            if (!in_array($share->user_id, $added)) {
                $users[] = $share->user->toArray();
                $added[] = $share->user_id;
            }
        }

        if (!in_array($model->owner->id, $added)) {
            $users[] = $model->owner->toArray();
            $added[] = $model->owner->id;
        }

        foreach ($model->project->teams()->with('users')->get() as $team) {
            if (!in_array($team->user_id, $added)) {
                $users[] = $team->owner->toArray();
                $added[] = $team->user_id;
            }

            foreach ($team->users as $user) {
                if (!in_array($user->id, $added)) {
                    $users[] = $user->toArray();
                    $added[] = $user->id;
                }
            }
        }

        return $users;
    }
}