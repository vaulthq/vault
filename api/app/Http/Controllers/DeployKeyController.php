<?php namespace App\Http\Controllers;

use App\Http\Requests\DeployKeyRequest;
use App\Vault\Models\Entry;
use App\Vault\Models\History;
use Symfony\Component\HttpFoundation\JsonResponse;

class DeployKeyController extends Controller
{
    public function find(DeployKeyRequest $request)
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
                History::make('entry', 'Accessed entry via API', $key->id);
                return $key->toArray() + ['password' => $key->password];
            }

            return new JsonResponse(['message' => 'Key found ('.$key->id.'), but access is insufficient.'], 403);
        }

        return new JsonResponse(['message' => 'No suitable key found.'], 404);
    }
}
