<?php namespace App\Console\Commands;

use App\Vault\Encryption\KeyPairGenerator;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class KeyGenerateMaster extends Command
{
	protected $signature = 'key:generate:master';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Create RSA key pair for master key';

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
		$path = storage_path('keys/master.pri');
		$pathPublic = config('app.backup_key');

		if ($this->filesystem->exists($pathPublic)) {
			$this->error('Master key already exist!');
			return;
		}

		$pass = str_random(32);
		$pair = KeyPairGenerator::generate($pass);

		file_put_contents($path, $pair['private']);
		file_put_contents($pathPublic, $pair['public']);

		$this->info('Generated key passprase (write this on paper, will be used to recover lost passwords):');
		$this->warn($pass);
	}

}
