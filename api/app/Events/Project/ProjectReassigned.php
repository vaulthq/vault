<?php namespace App\Events\Project;

use App\Events\Event;
use App\Vault\Models\Project;

class ProjectReassigned extends Event
{
	/**
	 * @var Project
	 */
	private $project;

	/**
	 * @param Project $project
	 */
	public function __construct(Project $project)
	{
		$this->project = $project;
	}

	/**
	 * @return Project
	 */
	public function getProject()
	{
		return $this->project;
	}
}
