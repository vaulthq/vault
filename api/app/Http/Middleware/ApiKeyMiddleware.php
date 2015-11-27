<?php namespace App\Http\Middleware;

use App\Vault\Exception\InvalidAuthException;
use App\Vault\Models\User;
use App\Vault\Security\ApiKey;
use Illuminate\Auth\Guard;

class ApiKeyMiddleware
{
    /**
     * @var Guard
     */
    private $manager;
    /**
     * @var ApiKey
     */
    private $key;

    public function __construct(Guard $manager, ApiKey $key)
    {
        $this->manager = $manager;
        $this->key = $key;
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
        try {
            $userAndKey = $this->key->extractKeyAndUser($request);

            if ($userAndKey) {
                /** @var User $user */
                $user = $userAndKey['user'];
                if ($user->isDisabled()) {
                    abort(403, 'User is disabled');
                }

                $this->manager->setUser($user);
            }


            return $next($request);

        } catch (InvalidAuthException $e) {
            abort(401, $e->getMessage());
        }

        abort(401, 'User could not be found.');
    }
}
