<?php

namespace App\Console\Commands;

use App\Vault\Encryption\EntryCrypt;
use App\Vault\Encryption\PrivateKey;
use App\Vault\Encryption\Sealer;
use App\Vault\Models\Entry;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class KeyCheckCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'entry:check {id} {keyPath}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Output entry password by decrypting it from backup key';

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
        $key = new PrivateKey($this->fs->get($this->argument('keyPath')));
        $key->unlock(md5($this->ask('What is the master key secret?')));

        $entry = Entry::where('id', $this->argument('id'))->first();
        $masterShare = $entry->keyShares()->whereNull('user_id')->firstOrFail();

        $this->output->writeln("Password:");
        $this->output->writeln($this->sealer->unseal($entry->data, $masterShare->public, $key));
    }
}
