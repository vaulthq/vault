<?php

use Illuminate\Database\Eloquent\SoftDeletingTrait;

class Team extends Eloquent
{
    use SoftDeletingTrait;

    protected $guarded = ['id', 'created_at', 'updated_at', 'user_id', 'deleted_at'];
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'team';

    protected $hidden = [
        'deleted_at'
    ];

    protected $appends = ['can_edit'];

    public function getCanEditAttribute()
    {
        $userId = Auth::user()->id;
        return $this->user_id == $userId;
    }

    public function owner()
    {
        return $this->belongsTo('User', 'user_id');
    }
}