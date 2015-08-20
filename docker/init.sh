#!/bin/bash

if [ ! -f /var/www/api/.env ]; then
   echo "[info] copy .env"
   cp /var/www/api/.env.sample /var/www/api/.env
fi

if [ -f /var/www/api/composer.json ] && [ ! -d /var/www/api/vendor ]; then
   echo "[info] Composer in background"
   composer install --optimize-autoloader --working-dir=/var/www/api
fi

chmod 777 -R /var/www/api/storage /var/www/api/bootstrap/cache

echo "[info] Waiting for mysql"
sleep 10

echo "[info] Migrating database"
php /var/www/api/artisan migrate --no-interaction --env=local || true
echo "[info] Seeding database"
php /var/www/api/artisan db:seed --no-interaction --env=local || true
