<?php
class RecentController extends \BaseController
{
	/**
	 * Display a listing of the recently accessed resources.
	 *
	 * @return Response
	 */
	public function index()
	{
		return DB::table('entry')
            ->leftJoin('history', 'entry.id', '=', 'history.model_id')
            ->leftJoin('project', 'entry.project_id', '=', 'project.id')
            ->where('history.model', 'password')
            ->where('history.user_id', Auth::user()->id)
            ->select('entry.id', 'entry.name', 'entry.url', 'entry.project_id', 'history.created_at', 'project.name as project_name', 'entry.note')
            ->orderBy('history.id', 'desc')
            ->take(15)
            ->get();
	}
}
