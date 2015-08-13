<?php namespace App\Http\Controllers;

use App\Vault\Models\ApiKey;
use Illuminate\Support\Facades\Auth;

class ApiKeyController extends Controller
{
    public function index()
    {
        return Auth::user()->apiKeys()->get();
	}

    public function create()
    {
        $key = new ApiKey();

        $key->user_id = Auth::user()->id;
        $key->key_public = str_random(32);
        $key->key_secret = str_random(32);

        $key->save();

        return $key->toArray() + ['key_secret' => $key->key_secret];
    }

    public function delete(ApiKey $api)
    {
        if ($api->user_id != Auth::user()->id) {
            abort(403);
        }

        $api->delete();
    }
}
