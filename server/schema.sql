DROP TABLE IF EXISTS hackers;

DROP TABLE IF EXISTS teams;

CREATE TABLE hackers (
    UUID INTEGER PRIMARY KEY AUTOINCREMENT,
    teamID INTEGER,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    school TEXT NOT NULL,
    discord TEXT UNIQUE,
    confirmationNumber NUMBER,
    isConfirmed BOOLEAN
);

CREATE TABLE teams (
    teamID TEXT PRIMARY KEY,
    teamName TEXT,
    owner TEXT,
    teamMember1 TEXT,
    teamMember2 TEXT,
    teamMember3 TEXT
);
