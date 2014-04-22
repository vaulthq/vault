<?php

class ShareController extends \BaseController {

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
        $validator = Validator::make([
            'user_id' => Input::get('user_id'),
            'entry_id' => Input::get('id')
        ], Share::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        $entry = Entry::findOrFail(Input::get('id'));
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $model = new Share();
        $model->user_by_id = Auth::user()->id;
        $model->user_id = Input::get('user_id');
        $model->entry_id = Input::get('id');
        $model->save();

        History::make('share', 'Shared entry.', $model->id);

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
		$model = Share::where('entry_id', $id)->get();

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
        $model = Share::findOrFail($id);

        $entry = Entry::findOrFail($model->entry_id);
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        History::make('entry', 'Deleted share.', $id);

        $model->delete();
	}

}