/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

module.exports.initLoginHandlers = function (app) {
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
};
