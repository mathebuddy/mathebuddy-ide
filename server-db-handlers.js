/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

const help = require('./server-help.js');

module.exports.initDatabaseHandlers = function (app, connection) {
  // This handler changes the path in table Content for all versions of that file.
  app.post('/updateDB_ContentPath', (request, response) => {
    // TODO: check if same path already exists
    const contentId = request.body.id;
    const contentNewPath = request.body.path;
    if (help.isContentPathValid(contentNewPath) == false) {
      response.send('The path is invalid. Format must be: COURSE/PATH');
      response.end();
      return;
    }
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
  app.post('/insertDB_Content', (request, response) => {
    // TODO: check if user is allowed to do this
    // TODO: check if same path already exists
    // TODO: write correct user id into database
    const path = request.body.path.trim();
    if (help.isContentPathValid(path) == false) {
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

  app.post('/selectDB_Content', (request, response) => {
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
            date: help.formatDate(entry['contentDate']),
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

  app.post('/selectDB_User', (request, response) => {
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
          createDate: help.formatDate(entry['userDate']),
          loginDate: help.formatDate(entry['userLastLogin']),
          admin: entry['userAdmin'],
        });
      }
      const data = JSON.stringify({ rows: rows });
      response.send(data);
      response.end();
      return;
    });
  });

  app.post('/selectDB_Access', (request, response) => {
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
          date: help.formatDate(entry['accessDate']),
        });
      }
      const data = JSON.stringify({ rows: rows });
      response.send(data);
      response.end();
      return;
    });
  });
};
