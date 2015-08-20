<?php namespace App\Events\Observer;

use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\Share;

class ShareObserver
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

    public function creating(Share $share)
    {
        return $share->entry->can_edit;
    }

    public function created(Share $share)
    {
        $this->logger->log('share', 'Shared entry.', $share->entry->id);
    }

    public function deleting(Share $share)
    {
        return $share->entry->can_edit;
    }

    public function deleted(Share $share)
    {
        $this->logger->log('share', 'Deleted share.', $share->id);
    }
}
