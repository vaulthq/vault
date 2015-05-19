<?php namespace App\Handlers\Events;

use App\Events\User\ProjectReassigned;
use App\Events\User\UserDeleted;
use App\Vault\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectEventHandler
{
	public function onUserDeleted(UserDeleted $event)
	{
		foreach (Project::where('user_id', $event->getUser()->id)->get() as $project) {
			$project->user_id = Auth::user()->id;
			$project->save();

			event(new ProjectReassigned($project));
		}
	}

	public function subscribe($events)
	{
		$events->listen('App\Events\User\UserDeleted', 'App\Handlers\Events\ProjectEventHandler@onUserDeleted');
	}

}
