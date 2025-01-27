DROP TABLE IF EXISTS hackers;

DROP TABLE IF EXISTS teams;

CREATE TABLE hackers (
    UUID TEXT PRIMARY KEY,
    teamID TEXT,
    firstName TEXT,
    lastName TEXT,
    password TEXT,
    email TEXT,
    school TEXT,
    discord TEXT,
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
