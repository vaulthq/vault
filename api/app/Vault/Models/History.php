<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];
    protected $table = 'history';

    public function keys()
    {
        return $this->hasMany('Entry', 'project_id');
    }
}
