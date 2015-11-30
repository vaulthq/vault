<?php namespace App\Events\Observer;

use App\Vault\Models\Entry;

class EntryObserver extends BaseObserver
{
    public function created(Entry $entry)
    {
        $this->log(sprintf('Created entry "%s" in project "%s".', $entry->name, $entry->project->name), $entry);
    }

    public function updating(Entry $entry)
    {
        return $entry->can_edit;
    }

    public function updated(Entry $entry)
    {
        if ($entry->isDirty('data')) {
            $this->log('Updated entry password.', $entry);
        }

        $this->log('Updated entry details.', $entry);
    }

    public function deleting(Entry $entry)
    {
        return $entry->can_edit;
    }

    public function deleted(Entry $entry)
    {
        $this->log(sprintf('Deleted entry "%s" in project "%s".', $entry->name, $entry->project->name), $entry);
    }
}
