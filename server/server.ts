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

import express from 'express';
import session from 'express-session';
import mysql from 'mysql';
import bcrypt from 'bcryptjs';

console.log('mathe:buddy IDE, 2022 by Andreas Schwenk, TH Koeln');
console.log('Started: ' + new Date().toLocaleString());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'mathebuddy',
  password: 'mathebuddy', // database only accessible from localhost!
  database: 'mathebuddy',
  multipleStatements: false,
});

const app = express();

app.use(
  session({
    secret: 'secret',
    key: 'myCookie',
    cookie: { httpOnly: false, sameSite: true },
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.sendFile('index.html', { root: __dirname });
});

app.get('/blub', (request, response) => {
  if (
    typeof request.session.username === 'undefined' ||
    request.session.username.length == 0
  ) {
    response.send({});
    response.end();
    return;
  }
  let query = 'SELECT id FROM Content;';
  connection.query(query, [], function (error, results, fields) {
    for (const entry of results) {
      console.log(entry);
    }
    response.send('blub');
    response.end();
  });
});

app.post('/login', (request, response) => {
  const username = request.body.username;
  const password = request.body.password;
  const query =
    'SELECT userPasswordHash FROM User WHERE userLogin=' +
    mysql.escape(username);
  connection.query(query, [], function (error, results, fields) {
    if (error) {
      request.session.username = '';
      response.send('LOGIN FAILED');
      response.end();
      return;
    }
    const passwordHashFromDB = results[0].password;
    if (bcrypt.compareSync(password, passwordHashFromDB)) {
      request.session.username = username;
      request.session.userid = parseInt(results[0].id);
      console.log(
        'user ' + username + ' (' + request.session.userid + ') logged in.',
      );
      response.send('LOGIN OK');
    } else {
      request.session.username = '';
      request.session.userid = -1;
      response.send('WRONG LOGIN DATA');
    }
    response.end();
  });
});

app.post('/logout', (request, response) => {
  request.session.username = '';
  request.session.userid = -1;
  response.end();
});

app.listen(3000);
