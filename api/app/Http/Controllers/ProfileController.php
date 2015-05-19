<?php namespace App\Http\Controllers;

use App\Vault\Models\History;
use App\Vault\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;

class ProfileController extends Controller
{
	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
        if (!Hash::check(Input::get('old'), Auth::user()->password)) {
            return Response::make('Old password does not match.', 419);
        }

        if (Input::get('new') != Input::get('repeat')) {
            return Response::make('New passwords do not match.', 419);
        }

        History::make('auth', 'User changed password.', Auth::user()->id);

        $model = User::findOrFail(Auth::user()->id);
        $model->password = Hash::make(Input::get('new'));
        $model->save();
	}

}
