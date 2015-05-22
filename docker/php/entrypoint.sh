#!/bin/bash
set -e

if [ -f /var/www/api/.env ]; then
   echo "copy .env"
   cp /var/www/api/.env.sample /var/www/api/.env
fi

if [ -f /var/www/composer.json ] && [ ! -d /var/www/vendor ]; then
   echo "Composer in background"
   composer install --optimize-autoloader --working-dir=/var/www/api &
fi

chmod 777 -R /var/www/api/storage

php /var/www/api/artisan migrate --no-interaction --env=local
php /var/www/api/artisan db:seed --no-interaction --env=local

echo "Run: $@"
exec "$@"
