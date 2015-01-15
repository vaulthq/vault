<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EntryToTeamMigration extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('entry_team', function($table)
		{
			$table->increments('id');

			$table->integer('team_id')->unsigned();
			$table->foreign('team_id')->references('id')->on('team');

			$table->integer('entry_id')->unsigned();
			$table->foreign('entry_id')->references('id')->on('entry');

			$table->integer('user_by_id')->unsigned();
			$table->foreign('user_by_id')->references('id')->on('user');

			$table->softDeletes();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//
	}

}
