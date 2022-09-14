# mathebuddy-ide

This repository contains the _mathebuddy_ Integrated Development Environment (IDE).

> ATTENTION: this repository is work-in-progress. Migration from https://github.com/sellquiz/sellquiz-language-workbench + new implementations will be done in the next weeks.

## Installation

### Web Server

TODO

### Install MariaDB

```bash
sudo apt install mariadb
sudo mysql_secure_installation
```

As the current root password is empty, skip by pressing [ENTER]. Then set the new root password. Remove the anonymous user and disallow a remote login for the root user. Optionally, remove the test database. Finally reload the privileges tables.

In macOS you can use [Homebrew](https://brew.sh) as package manager

```bash
brew install mariadb
brew services start mariadb
```

### Create the Database

Access MariaDB as root user `sudo mariadb -p`. Create a new database:

```bash
CREATE DATABASE mathebuddy;
```

Create tables with file `database/init.sql` from this repository:

```bash
sudo mariadb < database/init.sql
```

Create database user and set privileges:

```bash
CREATE USER mathebuddy@localhost IDENTIFIED BY 'mathebuddy';
GRANT ALL ON mathebuddy.* TO mathebuddy@localhost;
FLUSH PRIVILEGES;
```

### Configuration

Copy the configuration template and make changes if necessary (file `server-config.json` is untracked in git):

```bash
cp server-config-template.json server-config.json
```

| Property      | Description |
| ------------- | ----------- |
| `db-host`     | TODO        |
| `db-database` | TODO        |
| `db-user`     | TODO        |
| `db-password` | TODO        |
| `port`        | TODO        |

Make changes, if needed.
