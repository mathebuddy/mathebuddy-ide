/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

const help = require('./server-help.js');
const mysql = require('mysql');

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

  app.post('/selectDB_Courses', (request, response) => {
    // TODO: only get content rows with read access for current user
    const query = 'SELECT contentPath FROM Content ORDER BY contentPath';
    connection.query(query, [], function (error, results, fields) {
      const courses = [];
      for (const entry of results) {
        const course = entry['contentPath'].split('/')[0];
        if (courses.includes(course)) continue;
        courses.push(course);
      }
      const data = JSON.stringify({ courses: courses });
      response.send(data);
      response.end();
      return;
    });
  });

  app.post('/selectDB_CourseFiles', (request, response) => {
    // TODO: only get content files with read access for current user
    let courseName = mysql.escape(request.body.courseName);
    courseName = courseName.substring(0, courseName.length - 1);
    const query =
      'SELECT contentPath FROM Content WHERE contentPath LIKE ' +
      courseName +
      "/%' ORDER BY contentPath;";
    //console.log(query);
    connection.query(query, [], function (error, results, fields) {
      const files = [];
      for (const entry of results) {
        const file = entry['contentPath'].split('/')[1];
        if (files.includes(file)) continue;
        files.push(file);
      }
      const data = JSON.stringify({ files: files });
      response.send(data);
      response.end();
      return;
    });
  });

  app.post('/selectDB_ReadFile', (request, response) => {
    // TODO: only get content files with read access for current user
    let path = mysql.escape(request.body.path);
    const query =
      'SELECT contentPath, contentVersion, contentUserId, contentData, ' +
      'contentDate ' +
      'FROM Content ' +
      'WHERE contentPath=' +
      path +
      ' ' +
      'ORDER BY contentVersion';
    //console.log(query);
    connection.query(query, [], function (error, results, fields) {
      const fileVersions = [];
      //console.log(query);
      //console.log(results);
      for (const entry of results) {
        fileVersions.push({
          path: entry['contentPath'],
          version: entry['contentVersion'],
          userId: entry['contentUserId'],
          data: entry['contentData'],
          date: help.formatDate(entry['contentDate']),
        });
      }
      const data = JSON.stringify({ fileVersions: fileVersions });
      response.send(data);
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
