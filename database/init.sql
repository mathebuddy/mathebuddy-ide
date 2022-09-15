/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

USE mathebuddy;

/* Provides files. For each save, a new row is added. */
CREATE OR REPLACE TABLE Content (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    contentPath TEXT,
    contentVersion INTEGER DEFAULT 1,
    contentUserId INTEGER DEFAULT 0,
    contentData LONGTEXT CHARACTER SET utf8 DEFAULT '',
    contentDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Content
  (contentPath, contentVersion, contentUserId, contentData)
  VALUES
  ('demo/demo1', 1, 1, '');
INSERT INTO Content
  (contentPath, contentVersion, contentUserId, contentData)
  VALUES
  ('hm1/intro', 1, 1, '');
INSERT INTO Content
  (contentPath, contentVersion, contentUserId, contentData)
  VALUES
  ('hm1/functions', 1, 1, 'blub');
INSERT INTO Content
  (contentPath, contentVersion, contentUserId, contentData)
  VALUES
  ('hm1/functions', 2, 1, 'bla');

/* Users */
CREATE OR REPLACE TABLE User (
    id INTEGER PRIMARY key AUTO_INCREMENT,
    userLogin TEXT,
    userMail TEXT,
    userPasswordHash TEXT,
    userDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    userLastLogin DATETIME DEFAULT CURRENT_TIMESTAMP,
    userAdmin BOOLEAN DEFAULT '0'
);

INSERT INTO User
    (userLogin, userMail, userPasswordHash, userAdmin)
    VALUES
    ('admin', '', '', 1);
INSERT INTO User
    (userLogin, userMail, userPasswordHash, userAdmin)
    VALUES
    ('schwenk', 'andreas.schwenk@th-koeln.de', '', 0);

/* User privileges */
CREATE OR REPLACE TABLE Access (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    accessUserId INTEGER DEFAULT 0,
    accessContentPathRoot TEXT DEFAULT '',
    accessRead BOOLEAN DEFAULT '0',
    accessWrite BOOLEAN DEFAULT '0',
    accessQA BOOLEAN DEFAULT '0',
    accessDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Access
  (accessUserId, accessContentPathRoot, accessRead, accessWrite, accessQA)
  VALUES
  (2, 'hm1/', 1, 1, 0);
INSERT INTO Access
  (accessUserId, accessContentPathRoot, accessRead, accessWrite, accessQA)
  VALUES
  (2, 'hm2/', 1, 0, 0);

/* quality assurance attributes */
CREATE OR REPLACE TABLE QA (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    qaContentPath TEXT DEFAULT '', -- TODO: this is currently NOT updated when path of Content is changed!
    qaAttribute TEXT DEFAULT ''
);

/* chat */
CREATE OR REPLACE TABLE Chat (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chatUserLogin TEXT DEFAULT '',
    chatContentPath TEXT DEFAULT '',
    chatDate DATETIME DEFAULT CURRENT_TIMESTAMP
);
