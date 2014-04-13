<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

		// $this->call('UserTableSeeder');
        User::create([
            'email' => 'admin',
            'password' => Hash::make('admin'),
            'name' => 'Main',
            'surname' => 'Admin'
        ]);

        for ($i=0; $i<5; $i++) {
            Project::create([
                'name' => 'Project' . ($i + 1),
                'description' => 'some description about what dis is',
                'user_id' => 1
            ]);
        }
	}

}