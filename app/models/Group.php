<?php

use Illuminate\Database\Eloquent\SoftDeletingTrait;

class Group extends Eloquent
{
    use SoftDeletingTrait;

    protected $table = 'group';
}