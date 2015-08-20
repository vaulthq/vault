<?php namespace App\Events\Observer;

use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\ProjectTeam;

class ProjectTeamObserver
{
    /**
     * @var HistoryLogger
     */
    private $logger;

    /**
     * @param HistoryLogger $logger
     */
    public function __construct(HistoryLogger $logger)
    {
        $this->logger = $logger;
    }

    public function creating(ProjectTeam $team)
    {
        return $team->project->can_edit;
    }

    public function created(ProjectTeam $team)
    {
        $this->logger->log('project_team', 'Added team to project ('.$team->project->name.').', $team->id);
    }

    public function deleting(ProjectTeam $team)
    {
        return $team->project->can_edit;
    }

    public function deleted(ProjectTeam $team)
    {
        $this->logger->log('project_team', 'Removed team from project.', $team->id);
    }
}
