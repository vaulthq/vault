<?php namespace App\Listeners\Events;

use App\Events\Project\ProjectReassigned;
use App\Vault\Logging\HistoryLogger;

class ProjectHistoryLogger
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

	public function onReassign(ProjectReassigned $event)
	{
		$project = $event->getProject();
		$this->logger->log('reassign', 'Assigning project #' . $project->id . '.', $project->id);
	}

	public function subscribe($events)
	{
		$events->listen('App\Events\Project\ProjectReassigned', 'App\Listeners\Events\ProjectHistoryLogger@onReassign');
	}
}
