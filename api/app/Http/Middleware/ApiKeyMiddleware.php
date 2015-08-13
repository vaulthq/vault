<?php namespace App\Http\Middleware;

use App\Vault\Models\ApiKey;
use Illuminate\Auth\AuthManager;

class ApiKeyMiddleware
{
    /**
     * @var AuthManager
     */
    private $manager;

    public function __construct(AuthManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, \Closure $next)
    {
        $apiKey = $request->header('Authorization');

        if (!$apiKey) {
            abort(401, 'No Authorization header provided.');
        }

        if (strpos($apiKey, 'Basic ') === 0) {
            $apiKey = substr($apiKey, 5, strlen($apiKey));
        }

        $unwrapped = base64_decode($apiKey);
        $parts = explode(':', $unwrapped);

        if (sizeof($parts) != 2) {
            abort(401, 'Invalid Authorization header provided.');
        }

        $keyModel = ApiKey::where('key_public', $parts[0])->where('key_secret', $parts[1])->first();

        if ($keyModel) {
            $this->manager->onceUsingId($keyModel->user->id);
            return $next($request);
        }

        abort(401, 'User could not be found.');
    }
}
