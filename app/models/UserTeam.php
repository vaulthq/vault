<?php

class UserTeam extends Eloquent
{
    protected $guarded = ['id', 'updated_at', 'created_at', 'deleted_at', 'user_by_id'];
	protected $table = 'user_team';

    public static $rules = [
        'user_id' => 'required',
        'id' => 'required'
    ];

}