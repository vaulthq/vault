<?php

use Illuminate\Database\Eloquent\SoftDeletingTrait;

class Entry extends Eloquent
{
    use SoftDeletingTrait;

    protected $guarded = ['id', 'created_at', 'updated_at', 'user_id', 'deleted_at'];
	protected $table = 'entry';
    protected $hidden = [
        'deleted_at', 'password'
    ];
    protected $appends = ['can_edit'];

    public function getCanEditAttribute()
    {
        return Access::userCanAccessEntry($this);
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Crypt::encrypt($this->fixNewLines($value));
    }

    public function getPasswordAttribute($value)
    {
        return Crypt::decrypt($value);
    }

    public function groupAccess()
    {
        return $this->hasOne('GroupAccess', 'entry_id');
    }

    public function project()
    {
        return $this->belongsTo('Project', 'project_id');
    }

    public function owner()
    {
        return $this->belongsTo('User', 'user_id');
    }

    public function shares()
    {
        return $this->hasMany('Share', 'entry_id');
    }

    private function fixNewLines($str)
    {
        return preg_replace('~\r\n?~', "\r\n", $str);
    }

    private function belongsToUserTeam($userId)
    {
        $teams = $this->project->teams()->with('users')->get();

        foreach ($teams as $team) {
            if ($team->user_id == $userId) {
                return true;
            }

            foreach ($team->users as $user) {
                if ($user->id == $userId) {
                    return true;
                }
            }
        }

        return false;
    }
}