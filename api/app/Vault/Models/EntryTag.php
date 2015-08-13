<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;

class EntryTag extends Model
{
    protected $guarded = ['created_at', 'updated_at', 'user_id'];
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'entry_tag';

    protected $hidden = ['created_at', 'updated_at', 'user_id'];

    public static $rules = [
        'name' => 'required',
        'color' => 'required',
        'entry_id' => 'required',
    ];

    public function entry()
    {
        return $this->belongsTo('App\Vault\Models\Entry', 'entry_id');
    }
}
