<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EntryC extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
    public function up()
    {
        Schema::create('entry', function($table)
        {
            $table->increments('id');
            $table->string('name', 255)->nullable();
            $table->string('url', 255)->nullable();
            $table->text('password')->nullable();
            $table->text('note')->nullable();
            $table->integer('project_id')->unsigned();
            $table->foreign('project_id')->references('id')->on('project');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('user');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('entry');
    }

}
