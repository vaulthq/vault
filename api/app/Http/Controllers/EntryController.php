<?php namespace App\Http\Controllers;

use App\Vault\Models\Entry;
use App\Vault\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;

class EntryController extends Controller
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
        $model->username = Input::get('username');
        $model->project_id = Input::get('project_id');
        $model->user_id = Auth::user()->id;

        $model->save();

        History::make('entry', 'Created new entry.', $model->id);

        $model->load('tags');

        return $model;
    }

    /**
     * Display the specified resource.
     *
     * @param Entry $model
     * @return Response
     */
	public function show(Entry $model)
	{
        $model->load('tags');
		return $model;
	}

    /**
     * Update the specified resource in storage.
     *
     * @param Entry $model
     * @param Request $request
     * @return Response
     */
	public function update(Entry $model, Request $request)
	{
        if (!$model->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $model->name = $request->get('name');
        $model->username = $request->get('username');
        $model->url = $request->get('url');
        $model->note = $request->get('note');

        History::make('entry', 'Updated entry details.', $model->id);

        if ( ! is_null($request->get('password', null))) {
            History::make('entry_p', 'Updated entry password.', $model->id);

            $model->password = $request->get('password');
        }

        $model->save();
        $model->load('tags');
        return $model;
	}

    /**
     * Remove the specified resource from storage.
     *
     * @param Entry $model
     * @return Response
     * @throws \Exception
     */
	public function destroy(Entry $model)
	{
        if (!$model->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make('entry', 'Deleted entry #' . $model->id . ' ('.$model->project->name.').', $model->id);

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

        foreach ($model->teamShares()->with('team', 'team.users')->get() as $share) {
            $team = $share->team;
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
