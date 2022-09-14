/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

const lex = require('@multila/multila-lexer');

module.exports.formatDate = function (d) {
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
};

// check if a given path has grammar 'path = ID "/" ID;' (EBNF)
module.exports.isContentPathValid = function (path) {
  const lexer = new lex.Lexer();
  lexer.pushSource('', path);
  try {
    lexer.ID();
    lexer.TER('/');
    lexer.ID();
  } catch (e) {
    return false;
  }
  return true;
};
