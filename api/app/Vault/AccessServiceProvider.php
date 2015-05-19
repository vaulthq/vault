<?php namespace App\Vault;

use App\Vault\Security\Access;
use Illuminate\Support\ServiceProvider;

class AccessServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind('App\Vault\Security\Access', function() {
            return new Access($this->app->make('Illuminate\Contracts\Auth\Guard')->user());
        });
    }

}