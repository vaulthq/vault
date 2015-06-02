#!/bin/bash
set -e

if [ ! -f /var/www/api/.env ]; then
   echo "[info] copy .env"
   cp /var/www/api/.env.sample /var/www/api/.env
fi

if [ -f /var/www/api/composer.json ] && [ ! -d /var/www/api/vendor ]; then
   echo "[info] Composer in background"
   composer install --optimize-autoloader --working-dir=/var/www/api
fi

chmod 777 -R /var/www/api/storage


echo "[info] Waiting for mysql"
RET=1
RETRY=0
until [ $RETRY -ge 15 ] || [ $RET -eq 0 ]; do
    echo "[info] Waiting for confirmation of MySQL service startup"
    php -r 'return @fsockopen("mysql", "3306", $errNo, $errStr, 1) or exit(1);'
    RET=$?
    RETRY=$[$RETRY+1]
done

echo "[info] Migrating database"
php /var/www/api/artisan migrate --no-interaction --env=local || true
echo "[info] Seeding database"
php /var/www/api/artisan db:seed --no-interaction --env=local || true

echo "Run: $@"
exec "$@"
