<?php

class Entry extends Eloquent
{
    protected $softDelete = true;

    protected $guarded = ['id', 'created_at', 'updated_at', 'user_id', 'deleted_at'];
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'entry';

    protected $hidden = [
        'deleted_at', 'password'
    ];

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Crypt::encrypt($value);
    }

    public function getPasswordAttribute($value)
    {
        return Crypt::decrypt($value);
    }

    public function groupAccess()
    {
        return $this->hasOne('GroupAccess', 'entry_id');
    }
}