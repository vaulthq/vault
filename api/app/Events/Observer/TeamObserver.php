<?php namespace App\Events\Observer;

use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\Team;

class TeamObserver
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

    public function created(Team $team)
    {
        $this->logger->log('team', 'Created new team. (' . $team->name. ').', $team->id);
    }

    public function updating(Team $team)
    {
        return $team->can_edit;
    }

    public function updated(Team $team)
    {
        $this->logger->log('team', 'Updated team details.', $team->id);
    }

    public function deleting(Team $team)
    {
        return $team->can_edit;
    }

    public function deleted(Team $team)
    {
        $this->logger->log('team', 'Deleted team #' . $team->id . ' ('.$team->name.').', $team->id);
    }
}
