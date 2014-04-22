<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class GroupAccessMigration extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('group_access', function($table) {
            $table->increments('id');
            $table->boolean('admin');
            $table->boolean('dev');
            $table->boolean('tester');
            $table->boolean('pm');
            $table->integer('entry_id')->unsigned();
            $table->foreign('entry_id')->references('id')->on('entry');
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
        Schema::dropIfExists('group_access');
	}

}
