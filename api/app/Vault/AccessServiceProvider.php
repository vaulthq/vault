<?php
namespace Vault;

use Auth;
use Illuminate\Support\ServiceProvider;
use Vault\Security\Access;

class AccessServiceProvider extends ServiceProvider
{

    public function register()
    {
        $this->app->bind('Vault\Security\Access', function() {
            return new Access(Auth::user());
        });
    }

}