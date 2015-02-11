<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EntryShareMigration extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::create('share', function($table)
        {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('user');

            $table->integer('user_by_id')->unsigned();
            $table->foreign('user_by_id')->references('id')->on('user');

            $table->integer('entry_id')->unsigned();
            $table->foreign('entry_id')->references('id')->on('entry');

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
        Schema::dropIfExists('share');
	}

}
