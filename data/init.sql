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
    contentData LONGTEXT CHARACTER SET utf8 DEFAULT '',
    contentDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- insert into Content (contentPath, contentVersion, contentData) values ('hm1/intro.txt', 1, 'blub');

/* Users */
CREATE OR REPLACE TABLE User (
    id INTEGER PRIMARY key AUTO_INCREMENT,
    userLogin TEXT,
    userMail TEXT,
    userPasswordHash TEXT,
    userDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    userAdmin BOOLEAN DEFAULT '0'
);

INSERT INTO User
    (userLogin, userMail, userPasswordHash, userAdmin)
    VALUES
    ('admin', '', '', 1);

/* User privileges */
CREATE OR REPLACE TABLE Access (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    accessUserLogin TEXT DEFAULT '',
    accessContentPathRoot TEXT DEFAULT '',
    accessRead BOOLEAN DEFAULT '0',
    accessWrite BOOLEAN DEFAULT '0',
    accessQA BOOLEAN DEFAULT '0',
    accessDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* quality assurance attributes */
CREATE OR REPLACE TABLE QA (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    qaContentPath TEXT DEFAULT '',
    qaAttribute TEXT DEFAULT ''
);

/* chat */
CREATE OR REPLACE TABLE Chat (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chatUserLogin TEXT DEFAULT '',
    chatContentPath TEXT DEFAULT '',
    chatDate DATETIME DEFAULT CURRENT_TIMESTAMP
);
