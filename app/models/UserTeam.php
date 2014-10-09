<?php

use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableInterface;
use Illuminate\Database\Eloquent\SoftDeletingTrait;

class UserTeam extends Eloquent
{
    use SoftDeletingTrait;

    protected $softDelete = true;
    protected $guarded = ['id', 'updated_at', 'created_at', 'deleted_at', 'user_by_id'];
	protected $table = 'user_team';

}