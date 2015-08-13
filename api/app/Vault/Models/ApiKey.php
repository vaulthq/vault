<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApiKey extends Model
{
    use SoftDeletes;

    protected $table = 'api_key';

    protected $hidden = ['key_secret'];

    public function user()
    {
        return $this->belongsTo('App\Vault\Models\User', 'user_id');
    }
}
