<?php namespace App\Vault\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class History extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];
    protected $table = 'history';

    /**
     * @deprecated
     */
    public static function make($model, $message, $modelId = null)
    {
        History::create([
            'model' => $model,
            'message' => $message,
            'model_id' => $modelId,
            'user_id' => Auth::user()->id
        ]);
    }


    public function keys()
    {
        return $this->hasMany('App\Vault\Models\Entry', 'project_id');
    }
}
