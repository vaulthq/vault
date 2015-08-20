<?php namespace App\Http\Controllers;

use App\Vault\Models\EntryTeam;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class EntryTeamsController extends Controller
{
	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$teamId = Input::get('team_id');
		$entryId = Input::get('id');

        $validator = Validator::make([
            'team_id' => $teamId,
            'entry_id' => $entryId
        ], EntryTeam::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

		if (EntryTeam::where('team_id', $teamId)->where('entry_id', $entryId)->count() > 0) {
			return Response::make('This entry is already shared for this team.', 419);
		}

        $model = new EntryTeam();
        $model->user_by_id = Auth::user()->id;
        $model->entry_id = $entryId;
        $model->team_id = $teamId;

		if (!$model->save()) {
			abort(403);
		}

        return EntryTeam::with('team', 'team.users', 'team.owner')->where('id', $model->id)->first();
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
        return EntryTeam::with('team', 'team.users', 'team.owner')->where('entry_id', $id)->get();
    }

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 */
	public function destroy($id)
	{
        $model = EntryTeam::findOrFail($id);

        if (!$model->delete()) {
            abort(403);
        }
	}
}
