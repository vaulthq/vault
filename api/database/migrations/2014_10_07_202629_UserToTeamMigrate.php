<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserToTeamMigrate extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::create('user_group', function($table)
        {
            $table->increments('id');

            $table->integer('team_id')->unsigned();
            $table->foreign('team_id')->references('id')->on('team');

            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('user');

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
