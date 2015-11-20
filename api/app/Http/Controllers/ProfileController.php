<?php namespace App\Http\Controllers;

use App\Vault\Encryption\PrivateKey;
use App\Vault\Logging\HistoryLogger;
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
     * @param HistoryLogger $logger
     * @return Response
     */
	public function store(HistoryLogger $logger)
	{
        $oldPassword = Input::get('old');
        $newPassword = Input::get('new');

        if (!Hash::check($oldPassword, Auth::user()->password)) {
            return Response::make('Old password does not match.', 419);
        }

        if ($newPassword != Input::get('repeat')) {
            return Response::make('New passwords do not match.', 419);
        }

        try {
            $model = User::findOrFail(Auth::user()->id);
            $model->password = Hash::make($newPassword);

            $rsa = $model->rsaKey;
            $rsa->private = (new PrivateKey($rsa->private))->unlock($oldPassword)->lock($newPassword)->getKey();
            $rsa->save();

            $model->save();

            $logger->log('auth', 'User changed password.', Auth::user()->id);

        } catch (\RuntimeException $e) {
            return Response::make('New passwords do not match.', 419);
        }
	}

}
