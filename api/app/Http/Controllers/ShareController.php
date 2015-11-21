<?php namespace App\Http\Controllers;

use App\Vault\Encryption\EntryCrypt;
use App\Vault\Models\Entry;
use App\Vault\Models\KeyShare;
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
     * @param EntryCrypt $entryCrypt
     * @return Response
     */
    public function store(EntryCrypt $entryCrypt)
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

        if (KeyShare::where('user_id', $userId)->where('entry_id', $entryId)->count() > 0) {
            return Response::make('User can already access this key.', 419);
        }

        $entry = Entry::findOrFail($entryId);

        $model = new Share();
        $model->user_by_id = Auth::user()->id;
        $model->user_id = $userId;
        $model->entry_id = $entryId;

        if (!$model->save()) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $entryCrypt->reencrypt($entry);

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
     * @param EntryCrypt $entryCrypt
     * @return Response
     */
    public function destroy($id, EntryCrypt $entryCrypt)
    {
        $model = Share::findOrFail($id);
        $entry = $model->entry;

        if (!$model->delete()) {
            return Response::json(['flash' => 'Unauthorized.'], 403);
        }

        $entryCrypt->reencrypt($entry);
    }
}
