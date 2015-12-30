<?php namespace App\Console\Commands;

use App\Vault\Encryption\AccessDecider;
use App\Vault\Encryption\EntryCrypt;
use App\Vault\Models\Entry;
use App\Vault\Models\User;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Crypt;

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

    /**
     * @var AccessDecider
     */
    private $accessDecider;
    /**
     * @var EntryCrypt
     */
    private $entryCrypt;

    public function __construct(Filesystem $filesystem, AccessDecider $accessDecider, EntryCrypt $entryCrypt)
    {
        parent::__construct();
        $this->filesystem = $filesystem;
        $this->accessDecider = $accessDecider;
        $this->entryCrypt = $entryCrypt;
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

        $entries = Entry::with('project')->whereNull('project.deleted_at');

        foreach ($entries as $entry) {
            $list = $this->accessDecider->getUserListForEntry($entry);

            if ($list->count() == 0) {
                throw new \RuntimeException('Entry #' .$entry->id . ' has no access. Share it.');
            }
        }

        foreach ($entries as $entry) {
            if ($entry->password == '') {
                continue;
            }
            echo $entry->id .'... ';

            $this->entryCrypt->encrypt($entry->password, $entry);

            echo ' encrypted!' . "\n";
        }
    }
}
