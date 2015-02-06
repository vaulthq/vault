#!/bin/sh

echo "Running Composer";
php /usr/bin/composer install --working-dir=/var/www

echo "Running migrations";
php /var/www/artisan migrate --no-interaction

echo "Running seeding";
php /var/www/artisan db:seed --no-interaction
