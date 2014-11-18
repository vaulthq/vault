<?php namespace Vault\Security;

use Entry;
use Share;
use Team;
use User;

class Access
{
    /**
     * @var User
     */
    private $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function userCanAccessEntry(Entry $entry)
    {
        if ($this->isEntryOwner($entry)) {
            return true;
        }

        if ($this->belongsToAssignedTeams($entry)) {
            return true;
        }

        if ($this->isEntrySharedForUser($entry)) {
            return true;
        }

        return false;
    }

    private function isEntrySharedForUser(Entry $entry)
    {
        return Share::where('user_id', $this->user->id)->where('entry_id', $entry->id)->count() > 0;
    }

    private function isEntryOwner(Entry $entry)
    {
        return $this->user->id == $entry->user_id;
    }

    private function isTeamOwner(Team $team)
    {
        return $this->user->id == $team->user_id;
    }

    private function belongsToAssignedTeams(Entry $entry)
    {
        $teams = $entry->project->teams()->with('users')->get();

        foreach ($teams as $team) {
            if ($this->isTeamOwner($team)) {
                return true;
            }

            if ($this->isTeamMember($team)) {
                return true;
            }
        }

        return false;
    }

    private function isTeamMember(Team $team)
    {
        foreach ($team->users as $user) {
            if ($user->id == $this->user->id) {
                return true;
            }
        }

        return false;
    }
} 