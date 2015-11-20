<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RsaKey extends Model
{
    protected $table = 'rsa_key';

    protected $hidden = ['private', 'updated_at'];

    public function user()
    {
        return $this->belongsTo('App\Vault\Models\User', 'user_id');
    }
}
