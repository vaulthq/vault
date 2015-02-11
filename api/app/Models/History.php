<?php


use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'history';

    public function keys()
    {
        return $this->hasMany('Entry', 'project_id');
    }

    public static function make($model, $message, $modelId)
    {
        History::create([
            'model' => $model,
            'message' => $message,
            'model_id' => $modelId,
            'user_id' => Auth::user()->id
        ]);
    }
}
