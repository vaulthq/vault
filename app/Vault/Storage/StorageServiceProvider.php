<?php
namespace Vault\Storage;

use Illuminate\Support\ServiceProvider;

class StorageServiceProvider extends ServiceProvider
{

    public function register()
    {
        $this->app->bind(
            'Vault\Storage\Group\GroupRepository',
            'Vault\Storage\Group\EloquentGroupRepository'
        );
    }

}