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

const fs = require('fs');
const process = require('process');
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

console.log('mathe:buddy IDE, 2022 by Andreas Schwenk, TH Koeln');

if (fs.existsSync('server-config.json') == false) {
  console.error('Configuration file "server-config.json" does not exist.');
  console.error('Must copy server-config-template.json to server-config.json!');
  process.exit(-1);
}
const config = JSON.parse(fs.readFileSync('server-config.json', 'utf-8'));

const connection = mysql.createConnection({
  host: config['db-host'],
  user: config['db-user'],
  password: config['db-password'],
  database: config['db-database'],
  multipleStatements: false,
});

const app = express();

console.log('Started: ' + new Date().toLocaleString());

app.use(
  session({
    secret: 'secret',
    //key: 'myCookie', TODO
    cookie: { httpOnly: false, sameSite: true },
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/build', express.static(__dirname + '/build'));
app.use('/img', express.static(__dirname + '/img'));

app.get('/', (request, response) => {
  response.sendFile('index.html', { root: __dirname });
});

app.post('/readCourseConfig', (request, response) => {
  // TODO: only get content rows with write access for current user
  const query =
    'SELECT id, contentPath, contentVersion, contentUserId, ' +
    'contentDate FROM Content ORDER BY contentOrder ASC';
  connection.query(query, [], function (error, results, fields) {
    console.log('error: ' + error);
    console.log(results);
    for (const entry of results) {
      console.log(entry);
    }
    response.send('blub');
    response.end();
  });
});

app.post('/writeCourseConfig', (request, response) => {
  const query = 'TODO';
});

app.post('/login', (request, response) => {
  const username = request.body.userName;
  const password = request.body.password;
  const query =
    'SELECT userPasswordHash FROM User WHERE userLogin=' +
    mysql.escape(username);
  connection.query(query, [], function (error, results, fields) {
    if (error) {
      request.session.userName = '';
      response.send('LOGIN FAILED');
      response.end();
      return;
    }
    const passwordHashFromDB = results[0].password;
    if (bcrypt.compareSync(password, passwordHashFromDB)) {
      request.session.userName = username;
      request.session.userId = parseInt(results[0].id);
      console.log(
        'user ' + username + ' (' + request.session.userId + ') logged in.',
      );
      response.send('LOGIN OK');
    } else {
      request.session.userName = '';
      request.session.userId = -1;
      response.send('WRONG LOGIN DATA');
    }
    response.end();
  });
});

app.post('/logout', (request, response) => {
  request.session.userName = '';
  request.session.userId = -1;
  response.end();
});

app.listen(config['port']);
