<?php namespace App\Vault\Repository;

use App\Vault\Models\User;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    public function isLastAdmin(User $user)
    {
        $adminCount = DB::table('user')
            ->where('id', '<>', $user->id)
            ->where('group', User::GROUP_ADMIN)
            ->whereNull('deleted_at')
            ->count();

        return $adminCount <= 0;
    }
}