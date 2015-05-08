#!/bin/sh

echo "Creating vault database";
docker-compose run --rm mysql bash -c 'mysql -u root -h mysql -psecret -e "CREATE DATABASE IF NOT EXISTS vault;"'

echo "Granting write permissions to storage";
chmod 777 -R app/storage

echo "Copying default configs"
if [ ! -d app/config/local ]; then
    cp -R -u app/config/example app/config/local
fi

echo "Running Composer";
composer install

echo "Running migrations";
docker-compose run --rm php bash -c 'php artisan migrate --no-interaction --env=local'

echo "Running seeding";
docker-compose run --rm php bash -c 'php artisan db:seed --no-interaction --env=local'
