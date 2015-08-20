<?php namespace App\Events\Observer;

use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\Entry;

class EntryObserver
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

    public function created(Entry $entry)
    {
        $this->logger->log('entry', 'Created new entry.', $entry->id);
    }

    public function updating(Entry $entry)
    {
        return $entry->can_edit;
    }

    public function updated(Entry $entry)
    {
        if ($entry->isDirty('user_id')) {
            $this->logger->log(
                'entry-owner',
                sprintf('Changed entry owner from "%s" to "%s"', $entry->getOriginal('user_id'), $entry->user_id),
                $entry->id
            );
        }

        if ($entry->isDirty('password')) {
            $this->logger->log('entry', 'Updated entry password.', $entry->id);
        }

        $this->logger->log('entry', 'Updated entry details.', $entry->id);
    }

    public function deleting(Entry $entry)
    {
        return $entry->can_edit;
    }

    public function deleted(Entry $entry)
    {
        $this->logger->log('project', 'Deleted  #' . $entry->id . ' ('.$entry->project->name.').', $entry->id);
    }
}
