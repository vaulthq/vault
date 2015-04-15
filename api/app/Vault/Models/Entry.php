<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Crypt;
use Vault\Facades\Access;

class Entry extends Model
{
    use SoftDeletes;

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

    public function teamShares()
    {
        return $this->hasMany('EntryTeam', 'entry_id');
    }


    private function fixNewLines($str)
    {
        return preg_replace('~\r\n?~', "\r\n", $str);
    }
}
