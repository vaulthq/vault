<?php

use App\Vault\Models\Project;
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

            for ($i=0; $i<5; $i++) {
                Project::create([
                    'name' => 'Project' . ($i + 1),
                    'description' => 'some description about what dis is',
                    'user_id' => 1
                ]);
            }
            echo "DB Seeded...\n";
        } else {
            echo "DB Already Seeded...\n";
        }
	}

}
