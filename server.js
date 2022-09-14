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
const lex = require('@multila/multila-lexer');

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

app.post('/updateDB_ContentPath', (request, response) => {
  // This handler changes the path in table Content for all versions of that file.
  const contentId = request.body.id;
  const contentNewPath = request.body.path;
  const query =
    'UPDATE Content ' +
    'SET contentPath=' +
    mysql.escape(contentNewPath) +
    ' ' +
    'WHERE contentPath=(SELECT contentPath FROM Content WHERE id=' +
    mysql.escape(contentId) +
    ')';
  // update database
  // TODO: error handling
  connection.query(query, [], function (error, results, fields) {
    response.send('OK');
    response.end();
    return;
  });
});

// TODO: rename "write" to "insert"
app.post('/writeDB_Content', (request, response) => {
  // TODO: check if user is allowed to do this
  // TODO: check if same path already exists
  // TODO: write correct user id into database
  const path = request.body.path.trim();
  // check path format. Grammar in EBNF: path = ID "/" ID;
  const lexer = new lex.Lexer();
  lexer.pushSource('', path);
  try {
    lexer.ID();
    lexer.TER('/');
    lexer.ID();
  } catch (e) {
    response.send('The path is invalid. Format must be: COURSE/PATH');
    response.end();
    return;
  }
  // create database query
  const query =
    'INSERT INTO Content ' +
    '(contentPath, contentVersion, contentUserId, contentData) ' +
    'VALUES (' +
    mysql.escape(path) +
    ", 1, 1, 'still empty')";
  // update database
  // TODO: error handling
  connection.query(query, [], function (error, results, fields) {
    response.send('OK');
    response.end();
    return;
  });
});

app.post('/readDB_Content', (request, response) => {
  // TODO: only get content rows with write access for current user
  const query =
    'SELECT Content.id, contentPath, contentVersion, userLogin, ' +
    'contentDate, LENGTH(contentData) as contentBytes ' +
    'FROM Content INNER JOIN User ON Content.contentUserId = User.id ' +
    'ORDER BY contentPath';
  connection.query(query, [], function (error, results, fields) {
    const rows = [];
    // get current file version (highest version number)
    const versions = {};
    for (const entry of results) {
      if (
        entry['contentPath'] in versions == false ||
        versions[entry['contentPath']] < entry['contentVersion']
      ) {
        versions[entry['contentPath']] = entry['contentVersion'];
      }
    }
    // build result list consisting of only rows with highest version number
    for (const entry of results) {
      if (versions[entry['contentPath']] == entry['contentVersion']) {
        rows.push({
          id: entry['id'],
          path: entry['contentPath'],
          version: entry['contentVersion'],
          user: entry['userLogin'],
          date: formatDate(entry['contentDate']),
          bytes: entry['contentBytes'],
        });
      }
    }
    const data = JSON.stringify({ rows: rows });
    response.send(data);
    response.end();
    return;
  });
});

app.post('/readDB_User', (request, response) => {
  // TODO: check, if current user is allowed to do that!!
  const query =
    'SELECT id, userLogin, userMail, userDate, ' +
    'userLastLogin, userAdmin ' +
    'FROM User ORDER BY userLogin';
  connection.query(query, [], function (error, results, fields) {
    const rows = [];
    // build result list
    for (const entry of results) {
      rows.push({
        id: entry['id'],
        login: entry['userLogin'],
        mail: entry['userMail'],
        createDate: formatDate(entry['userDate']),
        loginDate: formatDate(entry['userLastLogin']),
        admin: entry['userAdmin'],
      });
    }
    const data = JSON.stringify({ rows: rows });
    response.send(data);
    response.end();
    return;
  });
});

app.post('/readDB_Access', (request, response) => {
  // TODO: check, if current user is allowed to do that!!
  const query =
    'SELECT Access.id, userLogin, accessContentPathRoot, accessRead, ' +
    'accessWrite, accessQA, accessDate ' +
    'FROM Access INNER JOIN User ON Access.accessUserId = User.id ' +
    'ORDER BY userLogin';
  connection.query(query, [], function (error, results, fields) {
    const rows = [];
    // build result list
    for (const entry of results) {
      rows.push({
        id: entry['id'],
        user: entry['userLogin'],
        path: entry['accessContentPathRoot'],
        read: entry['accessRead'],
        write: entry['accessWrite'],
        qa: entry['accessQA'],
        date: formatDate(entry['accessDate']),
      });
    }
    const data = JSON.stringify({ rows: rows });
    response.send(data);
    response.end();
    return;
  });
});

// TODO: remove this??
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

function formatDate(d) {
  d = new Date(d);
  let Y = '' + (d.getYear() + 1900);
  let M = '' + (d.getMonth() + 1);
  let D = '' + d.getDate();
  let h = '' + d.getHours();
  let m = '' + d.getMinutes();
  let s = '' + d.getSeconds();
  if (M.length < 2) M = '0' + M;
  if (D.length < 2) D = '0' + D;
  if (h.length < 2) h = '0' + h;
  if (m.length < 2) m = '0' + m;
  if (s.length < 2) s = '0' + s;
  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
}

app.listen(config['port']);
