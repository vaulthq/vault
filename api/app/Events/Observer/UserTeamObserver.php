<?php namespace App\Events\Observer;

use App\Vault\Models\UserTeam;

class UserTeamObserver extends BaseObserver
{
    public function creating(UserTeam $team)
    {
        return $team->team->can_edit;
    }

    public function created(UserTeam $team)
    {
        $this->log('Added "'.$team->user->email.'" to team "'.$team->team->name.'".', $team);
    }

    public function deleting(UserTeam $team)
    {
        return $team->team->can_edit;
    }

    public function deleted(UserTeam $team)
    {
        $this->log('Deleted "'.$team->user->email.'" from team "'.$team->team->name.'".', $team);
    }
}
