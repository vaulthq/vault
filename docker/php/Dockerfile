FROM datadoglt/php:56
MAINTAINER "Valdas Kalvaitis" <valdas@kalvaitis.eu>

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["/usr/sbin/php-fpm", "-F", "--force-stderr"]
