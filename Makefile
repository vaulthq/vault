.PHONY: run up configure assets stop drop reload

run: up configure assets

up:
	docker-compose up -d

configure:
	@echo "Granting write permissions to storage";
	$(shell chmod 777 -R api/storage)
	@echo "Copying default configs"
	$(shell if [ ! -f api/.env ]; then cp -u api/.env.sample api/.env; fi)
	@echo "Running Composer";
	docker-compose run --rm php bash -c 'cd api; composer install -o' || true
	@echo "Running migrations";
	docker-compose run --rm php bash -c 'php api/artisan migrate --no-interaction --env=local' || true
	@echo "Running seeding";
	docker-compose run --rm php bash -c 'php api/artisan db:seed --no-interaction --env=local' || true
	@echo "Installing NPM";
	docker-compose run --rm webtools bash -c 'npm install' || true
	@echo "Installing Bower";
	docker-compose run --rm webtools bash -c 'bower install --allow-root' || true

assets:
	@echo "Running Gulp";
	docker-compose run --rm webtools bash -c 'gulp' || true

fortunes:
	@curl -L https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/plugins/chucknorris/fortunes/chucknorris > /tmp/chucknorris
	@$(shell cat /tmp/chucknorris | sed '/%$$/d' | sed 's/\s*$$//' | sed 's/"/\\"/g' | awk -F '\n' '{print "\""$$1"\","}' > /tmp/chucknorris.js)
	@echo "window.fortunes = [$$(cat /tmp/chucknorris.js)];" > api/public/js/fortunes.js

stop:
	@echo "stopping vault containers"
	@docker stop $(shell docker ps -a | grep 'vault_' | awk '{print $$1}')

drop: stop
	@echo "removing vault containers"
	@docker rm $(shell docker ps -a | grep 'vault_' | awk '{print $$1}')

reload: drop run

