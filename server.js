/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

/*
  This server listens to port 3000. You may need to set up an Apache2 proxy server.
  Show all process that listen to port 3000 on Debian:
    apt install net-tools
    netstat -ltnp | grep -w ':3000'
*/

// external imports
const fs = require('fs');
const process = require('process');
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

// internal imports
const login_handlers = require('./server-login-handlers.js');
const db_handlers = require('./server-db-handlers.js');

// hello
console.log('mathe:buddy IDE, 2022 by Andreas Schwenk, TH Koeln');

// read config file
if (fs.existsSync('server-config.json') == false) {
  console.error('Configuration file "server-config.json" does not exist.');
  console.error('Must copy server-config-template.json to server-config.json!');
  process.exit(-1);
}
const config = JSON.parse(fs.readFileSync('server-config.json', 'utf-8'));

// establish connection to database
const connection = mysql.createConnection({
  host: config['db-host'],
  user: config['db-user'],
  password: config['db-password'],
  database: config['db-database'],
  multipleStatements: false,
});

// check connection (we do NOT use connection.connect(..), since this will
// result in a timeout after a few hours)
connection.query(
  'SELECT * FROM User WHERE id=1',
  [],
  function (error, results, fields) {
    if (error != null) {
      console.log(error);
      console.log(
        'cannot create connection to database. ' +
          'Check contents of file "server-config.json": ' +
          'Does the DB user exist? ' +
          'Also make sure to create tables by ' +
          'running "mariadb < database/init.sql".',
      );
      process.exit(-1);
    }
  },
);

// create express.js application
const app = express();

// log
console.log('Started: ' + new Date().toLocaleString());

// create session
app.use(
  session({
    secret: 'secret',
    //key: 'myCookie', TODO
    cookie: { httpOnly: false, sameSite: true },
    resave: true,
    saveUninitialized: true,
  }),
);

// express.js preferences
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/build', express.static(__dirname + '/build'));
app.use('/img', express.static(__dirname + '/img'));

// handler to get HTML file
app.get('/', (request, response) => {
  response.sendFile('index.html', { root: __dirname });
});

// database handlers
db_handlers.initDatabaseHandlers(app, connection);

// login handlers
login_handlers.initLoginHandlers(app);

// start listening
app.listen(config['port']);
