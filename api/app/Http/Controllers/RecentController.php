<?php namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RecentController extends Controller
{
    /**
     * Display a listing of the recently accessed resources.
     *
     * @return Response
     */
    public function index()
    {
        return DB::select("SELECT entry.id, entry.name, entry.url, entry.project_id, entry.note, entry.username, h.created_at, project.name AS project_name FROM history AS h
LEFT JOIN history AS h2 ON h.model_id = h2.model_id AND h2.id > h.id AND h.model = 'password' AND h2.model = 'password'
LEFT JOIN entry ON entry.id = h.model_id AND entry.deleted_at IS NULL
LEFT JOIN project ON project.id = entry.project_id
WHERE h2.id IS NULL
AND h.model = 'password'
AND h.user_id = ?
AND entry.id IS NOT NULL
ORDER BY h.id DESC
LIMIT 15", [Auth::user()->id]);
    }
}
