<?php namespace App\Events\Observer;

use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\EntryTeam;

class EntryTeamObserver
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

    public function creating(EntryTeam $team)
    {
        return $team->entry->can_edit;
    }

    public function created(EntryTeam $team)
    {
        $this->logger->log('entry_team', 'Added team to entry ('.$team->entry->name.').', $team->id);
    }

    public function deleting(EntryTeam $team)
    {
        return $team->entry->can_edit;
    }

    public function deleted(EntryTeam $team)
    {
        $this->logger->log('entry_team', 'Removed team from entry.', $team->id);
    }
}
