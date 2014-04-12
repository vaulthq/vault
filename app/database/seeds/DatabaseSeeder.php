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
	}

}