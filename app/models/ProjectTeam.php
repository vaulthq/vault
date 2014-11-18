<?php

class ProjectTeam extends Eloquent
{
    protected $guarded = ['id', 'updated_at', 'created_at', 'deleted_at', 'user_by_id'];
    protected $table = 'project_team';

    public static $rules = [
        'team_id' => 'required',
        'project_id' => 'required',
    ];
}