#!/bin/sh

echo "Creating vault database";
docker-compose run --rm mysql bash -c 'mysql -u root -h mysql -psecret -e "CREATE DATABASE IF NOT EXISTS vault;"'

echo "Granting write permissions to storage";
chmod 777 -R api/storage

echo "Copying default configs"
if [ ! -f api/.env ]; then
    cp -u api/.env.sample api/.env
fi

echo "Running Composer";
docker-compose run --rm php bash -c 'cd api; composer install -o'

echo "Running migrations";
docker-compose run --rm php bash -c 'php api/artisan migrate --no-interaction --env=local'

echo "Running seeding";
docker-compose run --rm php bash -c 'php api/artisan db:seed --no-interaction --env=local'

echo "Installing NPM";
docker-compose run --rm webtools bash -c 'npm install'

echo "Installing Bower";
docker-compose run --rm webtools bash -c 'bower install'

echo "Running Gulp";
docker-compose run --rm webtools bash -c 'gulp'
