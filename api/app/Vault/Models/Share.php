<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Share extends Model
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at', 'user_by_id'];

	protected $table = 'share';

    protected $hidden = [
        'deleted_at'
    ];

    public static $rules = [
        'user_id' => 'required',
        'entry_id' => 'required'
    ];

    public function owner()
    {
        return $this->belongsTo('App\Vault\Models\User', 'user_by_id');
    }

    public function user()
    {
        return $this->belongsTo('App\Vault\Models\User', 'user_id');
    }

    public function entry()
    {
        return $this->belongsTo('App\Vault\Models\Entry', 'entry_id');
    }
}
