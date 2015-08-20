<?php namespace App\Http\Controllers;

use App\Vault\Models\Entry;
use App\Vault\Models\Share;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class ShareController extends Controller
{
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

        Entry::findOrFail($entryId);

        $model = new Share();
        $model->user_by_id = Auth::user()->id;
        $model->user_id = $userId;
        $model->entry_id = $entryId;

        if (!$model->save()) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

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

        if (!$model->delete()) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }
    }
}
