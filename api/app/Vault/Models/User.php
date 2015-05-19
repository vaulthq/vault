<?php namespace App\Vault\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class User
 * @property string $email
 * @package App\Vault\Models
 */
class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    use SoftDeletes, Authenticatable, CanResetPassword;

    const GROUP_ADMIN = 'admin';
    const GROUP_DEV = 'dev';
    const GROUP_TESTER = 'tester';
    const GROUP_PM = 'pm';

    public static $groups = [
        self::GROUP_ADMIN => 'Administrator',
        self::GROUP_DEV => 'Developer',
        self::GROUP_TESTER => 'Tester',
        self::GROUP_PM => 'Project Manager'
    ];

    protected $guarded = ['id', 'updated_at', 'created_at', 'deleted_at'];
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'user';

    public static $rules = [
        'email' => 'required|unique:user',
        'group' => 'required',
        'password' => 'required'
    ];

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password', 'created_at', 'updated_at', 'deleted_at', 'remember_token');

	/**
	 * Get the unique identifier for the user.
	 *
	 * @return mixed
	 */
	public function getAuthIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Get the password for the user.
	 *
	 * @return string
	 */
	public function getAuthPassword()
	{
		return $this->password;
	}

	/**
	 * Get the e-mail address where password reminders are sent.
	 *
	 * @return string
	 */
	public function getReminderEmail()
	{
		return $this->email;
	}

    public function getRememberToken()
    {
        return $this->remember_token;
    }

    public function setRememberToken($value)
    {
        $this->remember_token = $value;
    }

    public function getRememberTokenName()
    {
        return 'remember_token';
    }

    public function share()
    {
        return $this->hasMany('App\Vault\Models\Share', 'user_id');
    }

    public function teams()
    {
        $this->belongsToMany('App\Vault\Models\Team', 'user_team', 'team_id', 'user_id');
    }

    public function isAdmin()
    {
        return $this->group == self::GROUP_ADMIN;
    }

    public function getGroup()
    {
        return self::$groups[$this->group];
    }
}
