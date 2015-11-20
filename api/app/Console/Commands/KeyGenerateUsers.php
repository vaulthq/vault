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
    protected $signature = 'keys:generate:users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates missing keys for existing users';

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
        $users = DB::table('user')
            ->select('user.*')
            ->leftJoin('rsa_key', 'user.id', '=', 'rsa_key.user_id')
            ->whereNull('rsa_key.id')
            ->get();

        foreach ($users as $userRow) {
            $newPassword = md5(Crypt::encrypt($userRow->email));

            $pair = KeyPairGenerator::generate($newPassword);

            $key = new RsaKey();
            $key->private = $pair['private'];
            $key->public = $pair['public'];
            $key->user_id = $userRow->id;

            $key->save();
            $user = User::find($userRow->id);
            $user->password = Hash::make($newPassword);
            $user->save();

            echo $user->email . "\t" . $newPassword . "\n";
        }
    }
}
