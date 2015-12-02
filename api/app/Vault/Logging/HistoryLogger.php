<?php namespace App\Vault\Logging;

use App\Vault\Models\History;
use Illuminate\Support\Facades\Auth;

class HistoryLogger
{
    /**
     * @param string $model
     * @param string $message
     * @param int|null $modelId
     */
    public function log($model, $message, $modelId = null)
    {
        History::create([
            'model' => $model,
            'message' => $message,
            'model_id' => $modelId,
            'user_id' => $this->getCurrentUserId()
        ]);
    }

    private function getCurrentUserId()
    {
        return Auth::check() ? Auth::user()->id : '1';
    }
}