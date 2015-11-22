<?php namespace App\Events\Observer;

use App\Vault\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectObserver extends BaseObserver
{
    public function created(Project $project)
    {
        $this->log('Created new project.', $project);
    }

    public function updating(Project $project)
    {
        return $project->can_edit;
    }

    public function updated(Project $project)
    {
        $this->log('Updated project details.', $project);
    }

    public function deleting(Project $project)
    {
        return $project->can_edit;
    }

    public function deleted(Project $project)
    {
        $this->log('Deleted project "'.$project->name.'".', $project);
    }
}
