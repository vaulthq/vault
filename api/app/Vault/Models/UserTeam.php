<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;

class UserTeam extends Model
{
    protected $guarded = ['id', 'updated_at', 'created_at', 'deleted_at', 'user_by_id'];
	protected $table = 'user_team';

    public static $rules = [
        'user_id' => 'required',
        'team_id' => 'required',
    ];

    public function user()
    {
        return $this->belongsTo('App\Vault\Models\User', 'user_id');
    }

    public function team()
    {
        return $this->belongsTo('App\Vault\Models\Team', 'team_id');
    }
}
