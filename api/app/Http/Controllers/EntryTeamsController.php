<?php namespace App\Http\Controllers;

use App\Vault\Models\Entry;
use App\Vault\Models\EntryTeam;
use App\Vault\Models\History;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class EntryTeamsController extends Controller
{

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

		$entry = Entry::findOrFail($entryId);
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $model = new EntryTeam();
        $model->user_by_id = Auth::user()->id;
        $model->entry_id = $entryId;
        $model->team_id = $teamId;
        $model->save();

        History::make('share', 'Added team to entry ('.$entry->name.').', $model->id);

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
