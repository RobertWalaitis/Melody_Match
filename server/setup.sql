CREATE TABLE Profile (
    user_id INTEGER PRIMARY KEY,
    name varchar(20),
    password varchar(20)
);

CREATE TABLE Song (
    song_id INTEGER PRIMARY KEY,
    title varchar(100),
    length INTEGER,
    genre varchar(100),
    artist varchar(100)
);

CREATE TABLE Liked (
    liked_song_id INTEGER references Song(song_id),
    profile_user_id INTEGER references Profile(user_id)
);
