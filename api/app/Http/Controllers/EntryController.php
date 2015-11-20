<?php namespace App\Http\Controllers;

use App\Vault\Encryption\AccessDecider;
use App\Vault\Encryption\EntryCrypt;
use App\Vault\Encryption\PrivateKey;
use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\Entry;
use App\Vault\Models\KeyShare;
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
    public function store(EntryCrypt $entryCrypt)
    {
        $model = new Entry();

        $model->name = Input::get('name');
        $model->url = Input::get('url');
        $model->password = Input::get('password');
        $model->note = Input::get('note');
        $model->username = Input::get('username');
        $model->project_id = Input::get('project_id');
        $model->user_id = Auth::user()->id;

        $sealed = $entryCrypt->encrypt(Input::get('password'), $model);

        $model->data = $sealed['sealed'];
        $model->save();

        foreach ($sealed['users'] as $id => $user) {
            $share = new KeyShare();
            $share->user_id = $user->id;
            $share->public = $sealed['keys'][$id];

            $model->shares()->save($share);
        }
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
        $model->name = $request->get('name');
        $model->username = $request->get('username');
        $model->url = $request->get('url');
        $model->note = $request->get('note');

        if (!is_null($request->get('password', null))) {
            $model->password = $request->get('password');
        }

        if (!$model->save()) {
            abort(403);
        }

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
        if (!$model->delete()) {
            abort(403);
        }
	}

    /**
     * Get password for Entry
     *
     * @param Entry $model
     * @param HistoryLogger $logger
     * @return mixed
     */
    public function getPassword(Entry $model, HistoryLogger $logger, EntryCrypt $entryCrypt)
    {
        if (!$model->can_edit) {
            abort(403);
        }

        $share = KeyShare::where(['user_id' => Auth::user()->id, 'entry_id' => $model->id])->first();

        $key = new PrivateKey(Auth::user()->rsaKey->private);
        $key->unlock('b');
        $data = $entryCrypt->decrypt($model, $share->public, $key);

        $logger->log('password', 'Accessed password #' . $model->id . ' ('.$model->project->name.').', $model->id);

        return Response::json(['password' => strlen($data) > 0 ? $data : ''], 200);
    }

    public function getAccess(Entry $entry, AccessDecider $decider)
    {
        return $decider->getUserListForEntry($entry);
    }
}
