CREATE TABLE Profile (
    name varchar(20) PRIMARY KEY,
    password varchar(20),
    likedsong1 INTEGER,
    likedsong2 INTEGER,
    likedsong3 INTEGER,
    likedsong4 INTEGER,
    likedsong5 INTEGER
);

CREATE TABLE Song (
    song_id INTEGER PRIMARY KEY,
    title varchar(100),
    length INTEGER,
    genre varchar(100),
    artist varchar(100)
);
