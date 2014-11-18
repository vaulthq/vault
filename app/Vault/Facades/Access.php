<?php namespace Vault\Facades;

use Illuminate\Support\Facades\Facade;

class Access extends Facade
{
    protected static function getFacadeAccessor() { return 'Vault\Security\Access'; }
}