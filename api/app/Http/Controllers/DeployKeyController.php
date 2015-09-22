<?php namespace App\Http\Controllers;

use App\Http\Requests\DeployKeyRequest;
use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\Entry;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class DeployKeyController extends Controller
{
    public function find(DeployKeyRequest $request, HistoryLogger $logger)
    {
        $host = $request->get('host');
        $username = $request->get('user');

        $availableKeys = Entry::where('url', $username . '@' . $host)
            ->orWhere(function($query) use ($username, $host) {
                $query->where('url', $host)->where('username', $username);
            })
            ->get();

        foreach ($availableKeys as $key) {
            if ($key->can_edit) {
                $logger->log('entry', 'Accessed entry via API', $key->id);
                return $key->toArray() + ['password' => $key->password];
            }

            return new JsonResponse(['message' => 'Key found ('.$key->id.'), but access is insufficient.'], 403);
        }

        return new JsonResponse(['message' => 'No suitable key found.'], 404);
    }

    public function findByTag(Request $request, HistoryLogger $logger)
    {
        /** @var \Illuminate\Database\Eloquent\Builder $q */
        $q = Entry::where('project_id', $request->get('project'))->select("entry.*");

        foreach ($request->get('tags') as $i => $tag) {
            $q->join("entry_tag as tag_$i", "tag_$i.entry_id", "=", "entry.id");
            $q->where("tag_$i.name", $tag);
        }

        $key = $q->get();

        if ($key->count() == 0) {
            abort(404);
        }

        if ($key->count() > 1) {
            abort(422);
        }

        $key = $key[0];

        if ($key->can_edit) {
            $logger->log('entry', 'Accessed entry via API', $key->id);
            return $key->toArray() + ['password' => $key->password];
        }

        return new JsonResponse(['message' => 'No suitable key found.'], 404);
    }
}
