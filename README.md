# mathebuddy-ide

This repository contains the _mathebuddy_ Integrated Development Environment (IDE).

> ATTENTION: this repository is work-in-progress. Migration from https://github.com/sellquiz/sellquiz-language-workbench + new implementations will be done in the next weeks.

## Installation

### Web Server

TODO

### Install MariaDB

```bash
sudo apt install mariadb
mysql_secure_installation
```

As the current root password is empty, skip by pressing [ENTER]. Then set the new root password. Remove the anonymous user and disallow a remote login for the root user. Optionally, remove the test database. Finally reload the privileges tables.

### Create the Database

Access MariaDB as root user `sudo mariadb -p`. Create a new database:

```bash
CREATE DATABASE mathebuddy;
```

Create tables with file `data/init.sql` from this repository:

```bash
mariadb < data/init.sql
```
