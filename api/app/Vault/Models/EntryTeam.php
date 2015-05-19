<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;

class EntryTeam extends Model
{
    protected $guarded = ['id', 'updated_at', 'created_at', 'deleted_at', 'user_by_id'];
    protected $table = 'entry_team';

    public static $rules = [
        'team_id' => 'required',
        'entry_id' => 'required',
    ];

    public function team()
    {
        return $this->belongsTo('App\Vault\Models\Team', 'team_id');
    }
}
