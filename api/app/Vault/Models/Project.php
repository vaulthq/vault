<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Project extends Model
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at', 'user_id', 'deleted_at'];
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'project';

    protected $appends = ['can_edit'];

    protected $hidden = [
        'deleted_at'
    ];

    public static $rules = [
        'name' => 'required',
    ];

    public function keys()
    {
        return $this->hasMany('Entry', 'project_id');
    }

    public function getCanEditAttribute()
    {
        return $this->user_id == Auth::user()->id;
    }

    public function teams()
    {
        return $this->belongsToMany('Team', 'project_team', 'project_id', 'team_id');
    }
}
