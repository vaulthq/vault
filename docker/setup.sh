#!/bin/sh

echo "Running Composer";
php /usr/bin/composer install --working-dir=/var/www/api

echo "Running migrations";
php /var/www/api/artisan migrate --no-interaction

echo "Running seeding";
php /var/www/api/artisan db:seed --no-interaction
