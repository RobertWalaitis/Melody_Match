CREATE TABLE Profile (
    name varchar(20) PRIMARY KEY,
    password varchar(20),
    likedsong1 references Song(song_id),
    likedsong2 references Song(song_id),
    likedsong3 references Song(song_id),
    likedsong4 references Song(song_id),
    likedsong5 references Song(song_id)
);

CREATE TABLE Song (
    song_id INTEGER PRIMARY KEY,
    title varchar(100),
    length INTEGER,
    genre varchar(100)
);
