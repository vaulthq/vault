<?php namespace App\Events\Observer;

use App\Vault\Logging\HistoryLogger;
use Illuminate\Database\Eloquent\Model;

class BaseObserver
{
    /**
     * @var HistoryLogger
     */
    private $logger;

    /**
     * @param HistoryLogger $logger
     */
    public function __construct(HistoryLogger $logger)
    {
        $this->logger = $logger;
    }

    /**
     * @param string $message
     * @param Model $model
     */
    protected function log($message, Model $model)
    {
        $ref = new \ReflectionClass($model);

        $this->logger->log($ref->getShortName(), $message, $model->getAttribute('id'));
    }
}
