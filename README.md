Vault [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/private-vault/vault/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/private-vault/vault/?branch=master) [![Build Status](https://scrutinizer-ci.com/g/private-vault/vault/badges/build.png?b=master)](https://scrutinizer-ci.com/g/private-vault/vault/build-status/master)
=========

Vault is a tool for securely sharing and storing secrets. A secret is anything that's cleartext - password, API key, certificate, PIN code, ...
 
The key features of this system:

* **Web client**: Vault includes a web frontend for easy access to your secrets. This is the primary way to interact with this system.
* **Data encryption**: Because secrets are stored in a database, they have to be encrypted. Vault uses AES-256 encryption to protect your secrets from unauthorized access.
* **API**: Vault also includes an API for accessing secrets automatically, enabling you to create integrations with other software.
* **Audit logs**: Every action in system is logged, so you can see who accessed which secrets.

## Production requirements

Vault uses AngularJS and Laravel 5.1 framework, so the requirements are:

* PHP > 5.5.9
* OpenSSL PHP Extension
* PDO PHP Extension
* Mbstring PHP Extension
* Tokenizer PHP Extension
* Web server (nginx)

## Production setup guide

Instructions how to setup project for production can be found here: [Installation instructions](https://github.com/private-vault/vault/wiki/Installation-instructions).

## Development: via docker-compose

1. Make sure that you have [`docker >1.5`](http://docs.docker.com/) installed:

        $ docker -v

2. Make sure that you have [`docker-compose >1.2`](http://docs.docker.com/compose/install/) installed:

        $ docker-compose --version

3. Copy `docker-compose.yml.dist` to `docker-compose.yml` and make any changes as needed 

4. Start containers:

        $ docker-compose up

5. Wait until composer, npm, bower, gulp runs and then you can access frontend at [http://localhost](http://localhost).

After initial setup, one account will be created which can be used to login. Login details are:

    Username: admin
    Password: admin


