# Vault

A secure password store and share system.

## Checkout to correct branch

    git checkout develop

## Setup via docker-compose

Make sure that you have `docker >1.5` installed:

    docker -v

Make sure that you have `docker-compose >1.2` installed:

    docker-compose --version

Start containers and configure:

    make

To reload containers and restart:

    make reload

To stop **vault** containers:

    make stop

To run them again:

    make

## Compile assets

To compile assets, run:

    make assets

## Login details

How to login:

    Username: admin
    Password: admin


