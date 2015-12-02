<?php namespace App\Jobs;

use App\Events\User\UserCreated;
use App\Vault\Encryption\KeyPairGenerator;
use App\Vault\Models\RsaKey;
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

        $keys = KeyPairGenerator::generate($this->password);
        $key = new RsaKey();
        $key->private = $keys['private'];
        $key->public = $keys['public'];
        $key->user_id = $model->id;
        $key->save();

        event(new UserCreated($model));

        return $model;
    }
}
