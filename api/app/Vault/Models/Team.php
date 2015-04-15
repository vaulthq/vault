<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Team extends Model
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at', 'user_id', 'deleted_at'];
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'team';

    protected $hidden = [
        'deleted_at'
    ];

    protected $appends = ['can_edit'];

    public static $rules = [
        'name' => 'required',
    ];

    public function getCanEditAttribute()
    {
        $userId = Auth::user()->id;
        if ($this->user_id == $userId) { // user is owner
            return true;
        }

        foreach ($this->users as $user) { // user belongs to team
            if ($user->id == $userId) {
                return true;
            }
        }

        return false;
    }

    public function owner()
    {
        return $this->belongsTo('User', 'user_id');
    }

    public function users()
    {
        return $this->belongsToMany('User', 'user_team', 'team_id', 'user_id');
    }

    public function projects()
    {
        return $this->belongsToMany('Project', 'project_team', 'team_id', 'project_id');
    }
}
