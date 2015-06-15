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
        $availableKeys = Entry::where('url', $host)->get();

        foreach ($availableKeys as $key) {

            if (ends_with($key->username, $host) && strpos($key->username, '@') !== false) {
                if ($key->can_edit) {
                    History::make('entry', 'Accessed via API', $key->id);
                    return $key->toArray() + ['password' => $key->password];
                }

                return new JsonResponse(['message' => 'Key found ('.$key->id.'), but access is insufficient.'], 403);
            }
        }

        return new JsonResponse(['message' => 'No suitable key found.'], 404);
    }
}
