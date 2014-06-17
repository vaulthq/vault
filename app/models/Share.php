<?php

use Illuminate\Database\Eloquent\SoftDeletingTrait;


class Share extends Eloquent
{
    use SoftDeletingTrait;

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
        return $this->belongsTo('User', 'user_by_id');
    }

    public function user()
    {
        return $this->belongsTo('User', 'user_id');
    }

    public function entry()
    {
        return $this->belongsTo('Entry', 'entry_id');
    }
}