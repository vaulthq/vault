<?php namespace App\Events\Observer;

use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\UserTeam;

class UserTeamObserver
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

    public function creating(UserTeam $team)
    {
        return $team->team->can_edit;
    }

    public function created(UserTeam $team)
    {
        $this->logger->log('user_team', 'Added "'.$team->user->email.'" to team "'.$team->team->name.'".', $team->id);
    }

    public function deleting(UserTeam $team)
    {
        return $team->team->can_edit;
    }

    public function deleted(UserTeam $team)
    {
        $this->logger->log('user_team', 'Deleted "'.$team->user->email.'" from team "'.$team->team->name.'".', $team->id);
    }
}
