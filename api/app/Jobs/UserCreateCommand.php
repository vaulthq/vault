<?php namespace App\Jobs;

use App\Events\User\UserCreated;
use App\Vault\Models\User;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Support\Facades\Hash;

class UserCreateCommand extends Command implements SelfHandling
{
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
     * @param string $email
     * @param string $password
     * @param string $group
     * @param string $name
     * @param string $surname
     */
    public function __construct($email, $password, $group, $name = '', $surname = '')
    {
        $this->email = $email;
        $this->password = $password;
        $this->group = $group;
        $this->name = $name;
        $this->surname = $surname;
    }

    public function handle()
    {
        $model = User::create([
            'email' => $this->email,
            'password' => Hash::make($this->password),
            'group' => $this->group,
            'name' => $this->name,
            'surname' => $this->surname
        ]);

        event(new UserCreated($model));

        return $model;
    }
}
