<?php namespace App\Http\Controllers;

class HistoryController extends Controller
{

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return DB::table('history')
            ->leftJoin('user', 'user.id', '=', 'history.user_id')
            ->select('history.id', 'history.model', 'history.message', 'history.created_at', 'user.email', 'user.group', 'history.model_id')
            ->orderBy('history.id', 'desc')
            ->take(500)
            ->get();
	}

}
