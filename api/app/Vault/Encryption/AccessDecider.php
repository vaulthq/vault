<?php namespace App\Vault\Encryption;

use App\Vault\Models\Entry;
use Illuminate\Support\Collection;

class AccessDecider
{
    /**
     * @param Entry $entry
     * @return Collection
     */
    public function getUserListForEntry(Entry $entry)
    {
        $list = collect([]);

        $list->push($entry->owner);

        foreach ($entry->shares()->get() as $share) {
            $list->push($share->user);
        }

        foreach ($entry->teamShares()->with('team', 'team.users')->get() as $share) {
            $list->push($share->team->owner);
            $list->merge($share->team->users);
        }

        foreach ($entry->project->teams()->with('users')->get() as $team) {
            $list->push($team->owner);
            $list->merge($team->users);
        }

        return $list->unique('id');
    }
}