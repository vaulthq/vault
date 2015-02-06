#!/bin/sh

FOUND=0
until [ $FOUND -eq 1 ] ; do
    mysql -e "desc mysql.user" -u root &> /dev/null

    EXITCODE=$?
    if [ $EXITCODE -eq 0 ]; then
        FOUND=1
        echo "Mysql running"
        sleep 1;
        continue
    fi

    echo "Waiting for mysql"
    sleep 1;
done

echo "Granting global permissions for root user";
mysql -u root -e "GRANT ALL ON *.* TO 'root'@'%' WITH GRANT OPTION;"

echo "Creating vault database";
mysql -u root -e "CREATE DATABASE IF NOT EXISTS vault;"

echo "Copying default configs"
if [ ! -d /var/www/app/config/local ]; then
    cp -R -u /var/www/app/config/example /var/www/app/config/local
fi
