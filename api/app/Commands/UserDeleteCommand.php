<?php namespace App\Commands;

use App\Events\User\UserCreated;
use App\Events\User\UserDeleted;
use App\Vault\Logging\HistoryLogger;
use App\Vault\Models\Entry;
use App\Vault\Models\History;
use App\Vault\Models\Team;
use App\Vault\Models\User;
use App\Vault\Repository\UserRepository;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Http\Exception\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserDeleteCommand extends Command implements SelfHandling
{
    /**
     * @var int
     */
    protected $id;

    /**
     * @param $id
     */
    public function __construct($id)
    {
        $this->id = $id;
    }

    public function handle(UserRepository $userRepo, HistoryLogger $logger)
    {
        $model = User::findOrFail($this->id);

        if ($userRepo->isLastAdmin($model)) {
            throw new HttpResponseException(new JsonResponse('You cannot delete last admin.', 419));
        }

        event(new UserDeleted($model));

        //@todo move to events

        foreach (Entry::where('user_id', $model->id)->get() as $item) {
            $item->user_id = Auth::user()->id;
            $item->save();
            $logger->log('reassign', 'Assigning entry #'.$item->id.'.', $item->id);
        }

        foreach (Team::where('user_id', $model->id)->get() as $item) {
            $item->user_id = Auth::user()->id;
            $item->save();
            $logger->log('reassign', 'Assigning team #'.$item->id.'.', $item->id);
        }

        $model->delete();
    }
}
