<?php

namespace App\Console\Commands;

use App\Vault\Encryption\KeyPairGenerator;
use App\Vault\Models\RsaKey;
use App\Vault\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class KeyGenerateUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'key:generate:users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates missing keys for existing users.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        if ($this->confirm('Generate keys for specific user? [yes|no]')) {
            $email = $this->ask('What is the email of user you want to generate keys for?');
            $users = DB::table('user')
                ->select('user.*')
                ->where('email', $email)
                ->get();
        } else {
            $users = DB::table('user')
                ->select('user.*')
                ->leftJoin('rsa_key', 'user.id', '=', 'rsa_key.user_id')
                ->whereNull('rsa_key.id')
                ->whereNull('user.deleted_at')
                ->get();
        }

        $this->generateKeys($users);
    }

    /**
     * @param $users
     */
    private function generateKeys($users)
    {
        foreach ($users as $userRow) {
            $newPassword = md5(Crypt::encrypt($userRow->email));

            $pair = KeyPairGenerator::generate($newPassword);

            $user = User::find($userRow->id);

            $key = new RsaKey();
            $key->private = $pair['private'];
            $key->public = $pair['public'];

            if ($user->rsaKey()->count()) {
                $user->rsaKey()->delete();
            }

            $user->rsaKey()->save($key);

            $user->password = Hash::make($newPassword);
            $user->save();

            echo $user->email . "\t" . $newPassword . "\n";
        }
    }
}
