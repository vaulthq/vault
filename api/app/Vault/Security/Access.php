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

    public function __construct(User $user = null)
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
        if (!$this->user) {
            return false;
        }

        return $entry->keyShares()->where('user_id', $this->user->id)->count() > 0;
    }

    public function userCanAccessProject(Project $project)
    {
        if (!$this->user) {
            return false;
        }

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
