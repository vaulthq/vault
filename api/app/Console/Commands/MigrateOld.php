<?php namespace App\Console\Commands;

use App\Vault\Models\User;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class MigrateOld extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:old';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate old keys to RSA system';
    /**
     * @var Filesystem
     */
    private $filesystem;

    public function __construct(Filesystem $filesystem)
    {
        parent::__construct();
        $this->filesystem = $filesystem;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        foreach (User::all() as $user) {
            if (!$user->rsaKey) {
                throw new \RuntimeException('user ' . $user->email .' has no RSA key. Create it using key:generate:users');
            }
        }

        if (!$this->filesystem->exists(config('app.backup_key'))) {
            $this->warn('Backup key does not exist. We recommend that you create one using key:generate:master');
        }
    }
}
