<?php namespace App\Vault\Facades;

use Illuminate\Support\Facades\Facade;

class Access extends Facade
{
    protected static function getFacadeAccessor() { return 'App\Vault\Security\Access'; }
}