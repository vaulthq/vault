FROM vaidasm/centos-lamp:0.1
MAINTAINER "DataDog" <info@datadog.lt>

# Set default time zone
COPY nginx.conf /etc/nginx/sites-available/default.conf
RUN echo "date.timezone = UTC" >> /etc/php.ini
RUN echo "cd /var/www" >> /home/www/.bashrc
