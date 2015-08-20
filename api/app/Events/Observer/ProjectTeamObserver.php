<?php namespace App\Events\Observer;

use App\Vault\Models\ProjectTeam;

class ProjectTeamObserver extends BaseObserver
{
    public function creating(ProjectTeam $team)
    {
        return $team->project->can_edit;
    }

    public function created(ProjectTeam $team)
    {
        $this->log('Added team to project "'.$team->project->name.'".', $team);
    }

    public function deleting(ProjectTeam $team)
    {
        return $team->project->can_edit;
    }

    public function deleted(ProjectTeam $team)
    {
        $this->log('Removed team from project.', $team);
    }
}
