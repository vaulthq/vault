<?php

use App\Vault\Encryption\KeyPairGenerator;
use App\Vault\Models\Project;
use App\Vault\Models\RsaKey;
use App\Vault\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
        Eloquent::unguard();

        if (!User::find(1)) {
            User::create([
                'email' => 'admin',
                'password' => Hash::make('admin'),
                'name' => 'Main',
                'surname' => 'Admin',
                'group' => User::GROUP_ADMIN
            ]);

            Project::create([
                'name' => 'Project 1',
                'description' => 'Default starter project',
                'user_id' => 1
            ]);

            $keys = KeyPairGenerator::generate('admin');

            $key = new RsaKey();
            $key->private = $keys['private'];
            $key->public = $keys['public'];
            $key->user_id = 1;
            $key->save();

            echo "DB Seeded...\n";
        } else {
            echo "DB Already Seeded...\n";
        }
	}

}
