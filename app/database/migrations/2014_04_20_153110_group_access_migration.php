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
            $table->boolean('admin')->default('0');
            $table->boolean('dev')->default('0');
            $table->boolean('tester')->default('0');
            $table->boolean('pm')->default('0');
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
