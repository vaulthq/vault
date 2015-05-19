<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;

class GroupAccess extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at',' admin', 'dev', 'tester', 'pm'];
    protected $hidden = ['created_at', 'updated_at'];
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'group_access';

    public function entry()
    {
        return $this->belongsTo('App\Vault\Models\Entry', 'entry_id');
    }

    public function getAdminAttribute($value)
    {
        return $value ? true : false;
    }

    public function getDevAttribute($value)
    {
        return $value ? true : false;
    }

    public function getPmAttribute($value)
    {
        return $value ? true : false;
    }

    public function getTesterAttribute($value)
    {
        return $value ? true : false;
    }
}
