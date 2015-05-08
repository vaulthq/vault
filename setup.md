# Setup via docker-compose
Make sure that you have `docker >1.5` installed:

    docker -v
    
Make sure that you have `docker-compose >1.2` installed:

    docker-compose --version
    
Start containers:
    
    docker-compose up -d
    
Init Composer, DB and Seeding:

    chmod +x init.sh && ./init.sh
    
# Compile assets

To compile assets, run:

    docker-compose run --rm webtools gulp watch

# Login details

How to login:

    Username: admin
    Password: admin

