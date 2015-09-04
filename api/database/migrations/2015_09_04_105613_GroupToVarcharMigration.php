<?php

use App\Vault\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class GroupToVarcharMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user', function($table) {
            $table->string('type', 20);
        });

        $users = User::all();

        foreach ($users as $user) {
            $user->type = $user->group == 'admin' ? 'admin' : 'member';
            $user->save();
        }

        Schema::table('user', function($table) {
            $table->dropColumn('group');
        });

        Schema::table('user', function($table) {
            $table->renameColumn('type', 'group');
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
