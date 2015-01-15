<?php

class EntryTeam extends Eloquent
{
    protected $guarded = ['id', 'updated_at', 'created_at', 'deleted_at', 'user_by_id'];
    protected $table = 'entry_team';

    public static $rules = [
        'team_id' => 'required',
        'entry_id' => 'required',
    ];

    public function team()
    {
        return $this->belongsTo('Team', 'team_id');
    }
}
