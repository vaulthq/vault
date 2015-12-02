<?php namespace App\Http\Middleware;

use App\Vault\Models\User;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTAuth;
use Tymon\JWTAuth\Payload;

class ValidUserMiddleware
{
    /**
     * @var JWTAuth
     */
    private $auth;

    public function __construct(JWTAuth $auth)
    {
        $this->auth = $auth;
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
        $payload = $this->auth->getPayload();

        if ($payload instanceof Payload) {
            if (!$payload->get('code')) {
                $this->abort(401);
            }

            if (!Auth::check()) {
                $this->abort(400);
            }

            if ($user = $payload->get('user')) {
                if (!isset($user['updated_at']) || $user['updated_at'] != Auth::user()->updated_at) {
                    $this->abort(401);
                }

                if ($user['group'] == User::GROUP_DISABLED) {
                    $this->abort(401);
                }
            }
        }

        return $next($request);
    }

    private function abort()
    {
        $this->auth->invalidate();
        abort(401);
    }
}
