<?php namespace App\Events\Observer;

use App\Vault\Models\Team;

class TeamObserver extends BaseObserver
{
    public function created(Team $team)
    {
        $this->log('Created new team. "' . $team->name. '".', $team);
    }

    public function updating(Team $team)
    {
        return $team->can_edit;
    }

    public function updated(Team $team)
    {
        $this->log('Updated team details.', $team);
    }

    public function deleting(Team $team)
    {
        return $team->can_edit;
    }

    public function deleted(Team $team)
    {
        $this->log('Deleted team "'.$team->name.'".', $team);
    }
}
