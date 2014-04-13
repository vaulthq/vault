<?php

class Project extends Eloquent
{
    protected $softDelete = true;

    protected $guarded = ['id'];
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'project';

    protected $hidden = [
        'deleted_at'
    ];

    public static $rules = [
        'name' => 'required',
    ];

    public function keys()
    {
        return $this->hasMany('Entry', 'project_id');
    }
}