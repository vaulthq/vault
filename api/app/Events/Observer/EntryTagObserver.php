<?php namespace App\Events\Observer;

use App\Vault\Models\EntryTag;

class EntryTagObserver extends BaseObserver
{
    public function creating(EntryTag $tag)
    {
        return $tag->entry->can_edit;
    }

    public function created(EntryTag $tag)
    {
        $this->log('Added tag "'.$tag->name.'" to entry "'.$tag->entry->name.'".', $tag);
    }

    public function deleting(EntryTag $tag)
    {
        return $tag->entry->can_edit;
    }

    public function deleted(EntryTag $tag)
    {
        $this->log('Removed tag "'.$tag->name.'" from entry "'.$tag->entry->name.'".', $tag);
    }
}
