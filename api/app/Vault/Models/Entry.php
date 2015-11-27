<?php namespace App\Vault\Models;

use App\Vault\Facades\Access;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Entry extends Model
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at', 'user_id', 'deleted_at'];
	protected $table = 'entry';
    protected $hidden = ['deleted_at', 'password', 'data'];
    protected $appends = ['can_edit'];

    public function getCanEditAttribute()
    {
        return Access::userCanAccessEntry($this);
    }

    public function groupAccess()
    {
        return $this->hasOne('App\Vault\Models\GroupAccess', 'entry_id');
    }

    public function project()
    {
        return $this->belongsTo('App\Vault\Models\Project', 'project_id');
    }

    public function owner()
    {
        return $this->belongsTo('App\Vault\Models\User', 'user_id');
    }

    public function shares()
    {
        return $this->hasMany('App\Vault\Models\Share', 'entry_id');
    }

    public function tags()
    {
        return $this->hasMany('App\Vault\Models\EntryTag', 'entry_id');
    }

    public function teamShares()
    {
        return $this->hasMany('App\Vault\Models\EntryTeam', 'entry_id');
    }

    public function keyShares()
    {
        return $this->hasMany('App\Vault\Models\KeyShare', 'entry_id');
    }
}
