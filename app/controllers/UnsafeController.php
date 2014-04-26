<?php

class UnsafeController extends \BaseController
{
	public function index()
	{
        return DB::table('history')
            ->select('history.model_id as id')
            ->distinct()
            ->leftJoin('user', 'user.id', '=', 'history.user_id')
            ->where('history.model', 'password')
            ->where('history.created_at', '<=', DB::raw('user.deleted_at'))
            ->whereNotNull('user.deleted_at')
            ->whereNotExists(function($q) {
                $q->select(DB::raw(1))
                    ->from('history as h')
                    ->where('h.model', 'entry_p')
                    ->where('h.model_id', '=', DB::raw('history.model_id'))
                    ->where('h.id', '>', DB::raw('history.id'));
            })
            ->get();
    }
}