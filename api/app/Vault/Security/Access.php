<?php namespace App\Vault\Security;

use App\Vault\Models\Entry;
use App\Vault\Models\Project;
use App\Vault\Models\User;

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

    /**
     * Estimates if user should be able to access entry.
     * It's possible, that found key share cannot unlock key
     *
     * @param Entry $entry
     * @return bool
     */
    public function userCanAccessEntry(Entry $entry)
    {
        return $entry->keyShares()->where('user_id', $this->user->id)->count() > 0;
    }

    public function userCanAccessProject(Project $project)
    {
        if ($project->user_id == $this->user->id) {
            return true;
        }

        foreach ($project->teams()->with('users')->get() as $team) {
            if ($team->can_edit) {
                return true;
            }
        }

        return false;
    }
}
