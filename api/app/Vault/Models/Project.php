<?php namespace App\Vault\Models;

use App\Vault\Facades\Access;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at', 'user_id', 'deleted_at'];
	protected $table = 'project';
    protected $appends = ['can_edit'];
    protected $hidden = ['deleted_at'];

    public static $rules = [
        'name' => 'required',
    ];

    public function keys()
    {
        return $this->hasMany('App\Vault\Models\Entry', 'project_id');
    }

    public function getCanEditAttribute()
    {
        return Access::userCanAccessProject($this);
    }

    public function teams()
    {
        return $this->belongsToMany('App\Vault\Models\Team', 'project_team', 'project_id', 'team_id');
    }

    public function owner()
    {
        return $this->belongsTo('App\Vault\Models\User', 'user_id');
    }
}
