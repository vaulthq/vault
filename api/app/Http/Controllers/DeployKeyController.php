<?php namespace App\Http\Controllers;

use App\Http\Requests\DeployKeyRequest;
use App\Vault\Encryption\Sealer;
use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\Entry;
use App\Vault\Security\ApiKey;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class DeployKeyController extends Controller
{
    /**
     * @var ApiKey
     */
    private $apiKey;
    /**
     * @var Sealer
     */
    private $sealer;
    /**
     * @var HistoryLogger
     */
    private $logger;

    public function __construct(ApiKey $apiKey, Sealer $sealer, HistoryLogger $logger)
    {
        $this->apiKey = $apiKey;
        $this->sealer = $sealer;
        $this->logger = $logger;
    }

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
            if ($entry = $this->getKey($request, $key)) {
                return $entry;
            }

            return new JsonResponse(['message' => 'Key found ('.$key->id.'), but access is insufficient.'], 403);
        }

        return new JsonResponse(['message' => 'No suitable key found.'], 404);
    }

    public function findByTag(Request $request)
    {
        $tags = $request->get('tags', []);

        if (sizeof($tags) == 0) {
            abort(404);
        }

        /** @var \Illuminate\Database\Eloquent\Builder $q */
        $q = Entry::where('project_id', $request->get('project', 0))->select("entry.*");

        foreach ($tags as $i => $tag) {
            $q->join("entry_tag as tag_$i", "tag_$i.entry_id", "=", "entry.id");
            $q->where("tag_$i.name", strtoupper($tag));
        }

        $key = $q->get();

        if ($key->count() == 0) {
            abort(404);
        }

        if ($key->count() > 1) {
            abort(422);
        }

        $key = $key[0];

        if ($entry = $this->getKey($request, $key)) {
            return $entry;
        }

        return new JsonResponse(['message' => 'No suitable key found.'], 404);
    }

    private function getKey(Request $request, Entry $entry)
    {
        $userAndKey = $this->apiKey->extractKeyAndUser($request);
        $share = $entry->keyShares()->where('user_id', $userAndKey['user']->id)->firstOrFail();

        if ($share) {
            $this->logger->log('entry', 'Accessed entry via API', $entry->id);
            return $entry->toArray() + ['password' => $this->sealer->unseal($entry->data, $share->public, $userAndKey['key'])];
        }

        return null;
    }
}
