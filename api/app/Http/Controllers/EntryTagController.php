<?php namespace App\Http\Controllers;

use App\Vault\Models\Entry;
use App\Vault\Models\EntryTag;
use App\Vault\Models\History;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class EntryTagController extends Controller
{

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$tags = DB::table('entry_tag')
			->select('id', 'entry_id', 'name', 'color')
			->groupBy('name')
			->orderBy('name')
			->get();

		return $tags;
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
		$name = strtoupper(Input::get('name'));
		$color = Input::get('color');
		$entryId = Input::get('entryId');

        $validator = Validator::make([
            'color' => $color,
            'entry_id' => $entryId,
            'name' => $name,
        ], EntryTag::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

		$entry = Entry::findOrFail($entryId);
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

		if ($entry->tags->contains('name', $name)) {
			return Response::make('Tag already present.', 419);
		}

        $model = new EntryTag();
		$model->user_id = Auth::user()->id;
        $model->name = $name;
        $model->color = $color;
        $model->entry_id = $entryId;
        $model->save();

        History::make('share', 'Added tag "'.$model->name.'" to entry ('.$entry->name.').', $model->id);

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
		//
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
        $model = EntryTag::findOrFail($id);

        $entry = Entry::findOrFail($model->entry_id);
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make('entry', 'Removed tag "'.$model->name.'" from entry.', $id);

        $model->delete();
	}


}
