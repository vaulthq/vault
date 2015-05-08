# Setup via docker-compose
Make sure that you have `docker >1.5` installed:

    docker -v
    
Make sure that you have `docker-compose >1.2` installed:

    docker-compose --version
    
Start containers:
    
    docker-compose up
    
Init Composer, DB and Seeding:

    chmod +x init.sh && ./init.sh
    
# Compile assets

Install globally with nodejs

    npm install -g gulp bower

Run these commands

    npm install
    npm run setup

# Login details

How to login:

    Username: admin
    Password: admin

