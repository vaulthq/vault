<?php namespace App\Http\Controllers;

class ShareController extends Controller
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
        $userId = Input::get('user_id');
        $entryId = Input::get('id');

        $validator = Validator::make([
            'user_id' => $userId,
            'entry_id' => $entryId
        ], Share::$rules);

        if ($validator->fails()) {
            return Response::make($validator->messages()->first(), 419);
        }

        if (Share::where('user_id', $userId)->where('entry_id', $entryId)->count() > 0) {
            return Response::make('This entry is already shared for this user.', 419);
        }

        $entry = Entry::findOrFail($entryId);
        if (!$entry->can_edit) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $model = new Share();
        $model->user_by_id = Auth::user()->id;
        $model->user_id = $userId;
        $model->entry_id = $entryId;
        $model->save();

        History::make('share', 'Shared entry.', $model->id);

        return Share::with('user')->where('id', $model->id)->first();
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        $model = Share::with('user')->where('entry_id', $id)->get();

        return $model;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
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
