<?php namespace App\Events\Observer;

use App\Vault\Models\EntryTeam;

class EntryTeamObserver extends BaseObserver
{
    public function creating(EntryTeam $team)
    {
        return $team->entry->can_edit;
    }

    public function created(EntryTeam $team)
    {
        $this->log('Added team to entry ('.$team->entry->name.').', $team);
    }

    public function deleting(EntryTeam $team)
    {
        return $team->entry->can_edit;
    }

    public function deleted(EntryTeam $team)
    {
        $this->log('Removed team from entry.', $team);
    }
}
