<?php namespace App\Events\Observer;

use App\Vault\Models\Share;

class ShareObserver extends BaseObserver
{
    public function creating(Share $share)
    {
        return $share->entry->can_edit;
    }

    public function created(Share $share)
    {
        $this->log('Shared entry.', $share);
    }

    public function deleting(Share $share)
    {
        return $share->entry->can_edit;
    }

    public function deleted(Share $share)
    {
        $this->log('Deleted share.', $share);
    }
}
