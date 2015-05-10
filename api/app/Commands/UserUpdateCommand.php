<?php namespace App\Commands;

use App\Events\User\UserCreated;
use App\Vault\Models\User;
use App\Vault\Repository\UserRepository;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Http\Exception\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UserUpdateCommand extends Command implements SelfHandling
{
    /**
     * @var int
     */
    protected $id;
    /**
     * @var string
     */
    protected $email;
    /**
     * @var string
     */
    protected $password;
    /**
     * @var string
     */
    protected $group;
    /**
     * @var string
     */
    protected $name;
    /**
     * @var string
     */
    protected $surname;

    /**
     * @param $email
     * @param $name
     * @param $surname
     * @param $id
     * @param string|null $group
     * @param string|null $password
     */
    public function __construct($email, $name, $surname, $id, $group = null, $password = null)
    {
        $this->id = $id;
        $this->email = $email;
        $this->password = $password;
        $this->group = $group;
        $this->name = $name;
        $this->surname = $surname;
    }

    public function handle(UserRepository $userRepo)
    {
        $model = User::findOrFail($this->id);

        $model->email = $this->email;
        $model->name = $this->name;
        $model->surname = $this->surname;

        if ($this->group) {
            if ($this->isBecomingNonAdmin($model) && $userRepo->isLastAdmin($model)) {
                throw new HttpResponseException(new JsonResponse('You cannot change this user group.', 419));
            }

            $model->group = $this->group;
        }

 /*       History::make('user', 'Updated user details.', $model->id);

        if (isset($data->password)) {
            History::make('user', 'Changed user password.', $model->id);
            $model->password = Hash::make($data->password);
        }*/

        $model->save();

//        event(new UserCreated($model));

        return $model;
    }

    /**
     * @param $model
     * @return bool
     */
    private function isBecomingNonAdmin($model)
    {
        return $model->group != $this->group && $model->group == User::GROUP_ADMIN;
    }
}