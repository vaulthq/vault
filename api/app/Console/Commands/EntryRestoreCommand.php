<?php

namespace App\Console\Commands;

use App\Vault\Encryption\EntryCrypt;
use App\Vault\Encryption\PrivateKey;
use App\Vault\Encryption\Sealer;
use App\Vault\Models\KeyShare;
use App\Vault\Models\User;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Crypt;

class EntryRestoreCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'entry:restore {email} {keyPath}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restores entries to user using backup key.';
    /**
     * @var EntryCrypt
     */
    private $crypt;
    /**
     * @var Filesystem
     */
    private $fs;
    /**
     * @var Sealer
     */
    private $sealer;

    /**
     * Create a new command instance.
     *
     * @param EntryCrypt $crypt
     * @param Filesystem $fs
     * @param Sealer $sealer
     */
    public function __construct(EntryCrypt $crypt, Filesystem $fs, Sealer $sealer)
    {
        parent::__construct();
        $this->crypt = $crypt;
        $this->fs = $fs;
        $this->sealer = $sealer;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $user = User::where('email', $this->argument('email'))->first();

        $key = new PrivateKey($this->fs->get($this->argument('keyPath')));
        $key->unlock(md5($this->ask('What is the master key secret?')));

        $entries = KeyShare::where('user_id', $user->id)->with('entry')->get();

        foreach ($entries as $share) {
            $masterShare = $share->entry->keyShares()->whereNull('user_id')->firstOrFail();
            $data = $this->sealer->unseal($share->entry->data, $masterShare->public, $key);

            $this->crypt->encrypt($data, $share->entry);
        }
    }
}
