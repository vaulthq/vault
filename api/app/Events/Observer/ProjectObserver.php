<?php namespace App\Events\Observer;

use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectObserver
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

    public function created(Project $project)
    {
        $this->logger->log('project', 'Created new project.', $project->id);
    }

    public function updating(Project $project)
    {
        return $project->can_edit || ($project->getOriginal('user_id') == Auth::user()->id);
    }

    public function updated(Project $project)
    {
        if ($project->isDirty('user_id')) {
            $this->logger->log(
                'project-owner',
                sprintf('Changed owner from "%s" to "%s".', $project->getOriginal('user_id'), $project->user_id),
                $project->id
            );
        }

        $this->logger->log('project', 'Updated project details.', $project->id);
    }

    public function deleting(Project $project)
    {
        return $project->can_edit;
    }

    public function deleted(Project $project)
    {
        $this->logger->log('project', 'Deleted project #' . $project->id . ' ('.$project->name.').', $project->id);
    }
}
