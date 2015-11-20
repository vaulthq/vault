<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;

class KeyShare extends Model
{
    protected $table = 'key_share';

    public function user()
    {
        return $this->belongsTo('App\Vault\Models\User', 'user_id');
    }

    public function entry()
    {
        return $this->belongsTo('App\Vault\Models\Entry', 'entry_id');
    }
}
