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

    public static $rules = [
        'name' => 'requred',
    ];
}