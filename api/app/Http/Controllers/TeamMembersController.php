<?php namespace App\Http\Controllers;

use App\Vault\Encryption\EntryCrypt;
use App\Vault\Models\UserTeam;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class TeamMembersController extends Controller
{
	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(EntryCrypt $entryCrypt)
	{
        $validator = Validator::make([
            'user_id' => Input::get('user_id'),
            'team_id' => Input::get('id')
        ], UserTeam::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $model = new UserTeam();
        $model->user_by_id = Auth::user()->id;
        $model->user_id = Input::get('user_id');
        $model->team_id = Input::get('id');

        if (!$model->save()) {
            abort(403);
        }
//@todo figure out this does not work
		foreach ($model->team->projects as $project) {
            foreach ($project->keys as $key) {
                $entryCrypt->reencrypt($key);
            }
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
		return UserTeam::where('team_id', $id)->get();
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id, EntryCrypt $entryCrypt)
	{
        $model = UserTeam::findOrFail($id);

        if (!$model->delete()) {
            abort(403);
        }

        foreach ($model->team->projects as $project) {
            foreach ($project->keys as $key) {
                $entryCrypt->reencrypt($key);
            }
        }
    }
}
