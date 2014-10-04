<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TeamsMigration extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::create('team', function($table)
        {
            $table->increments('id');

            $table->string('name', 255)->nullable();

            $table->integer('user_id')->unsigned();
            $table->foreign('user_by_id')->references('id')->on('user');

            $table->softDeletes();
            $table->timestamps();
        });
        Schema::dropIfExists('group');
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::dropIfExists('team');
	}

}
