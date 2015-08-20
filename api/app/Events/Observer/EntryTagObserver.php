<?php namespace App\Events\Observer;

use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\EntryTag;

class EntryTagObserver
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

    public function creating(EntryTag $tag)
    {
        return $tag->entry->can_edit;
    }

    public function created(EntryTag $tag)
    {
        $this->logger->log('tag', 'Added tag "'.$tag->name.'" to entry "'.$tag->entry->name.'".', $tag->id);
    }

    public function deleting(EntryTag $tag)
    {
        return $tag->entry->can_edit;
    }

    public function deleted(EntryTag $tag)
    {
        $this->logger->log('tag', 'Removed tag "'.$tag->name.'" from entry "'.$tag->entry->name.'".', $tag->id);
    }
}
