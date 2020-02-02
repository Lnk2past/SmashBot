CREATE TABLE players (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    discord_id  INT NOT NULL UNIQUE,
    active      BOOLEAN DEFAULT TRUE
);

CREATE TABLE fighters (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE
);

CREATE TABLE stages (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE,
    banned      BOOLEAN,
    starter     BOOLEAN,
    battlefield BOOLEAN,
    omega       BOOLEAN
);

CREATE TABLE seasons (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    start_date  DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date    DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE tournaments (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    start_date  DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    season      INT REFERENCES seasons(id),
    type        TEXT NOT NULL,
    format      TEXT NOT NULL,
    time        INTERVAL,
    stock       INT
);

CREATE TABLE matches (
    id          SERIAL PRIMARY KEY,
    date        DATE NOT NULL DEFAULT CURRENT_DATE,
    tournament  INT REFERENCES tournaments(id),
    location    TEXT NOT NULL,
    status      TEXT
);

CREATE TABLE match_results (
    id          SERIAL PRIMARY KEY,
    match       INT NOT NULL REFERENCES matches(id),
    winner      INT NOT NULL REFERENCES players(id)
);

CREATE TABLE games (
    id          SERIAL PRIMARY KEY,
    match       INT NOT NULL REFERENCES matches(id)
);

CREATE TABLE player_fighter_games (
    id          SERIAL PRIMARY KEY,
    game        INT NOT NULL REFERENCES games(id),
    player      INT NOT NULL REFERENCES players(id),
    fighter     INT NOT NULL REFERENCES fighters(id),
    stage       INT NOT NULL REFERENCES stages(id),
    win         BOOLEAN
);
