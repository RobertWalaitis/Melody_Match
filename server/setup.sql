CREATE TABLE Profiles (
    profile_id INTEGER PRIMARY KEY,
    profile_name varchar(20),
    profile_password varchar(20)
);

CREATE TABLE Song (
    song_id INTEGER PRIMARY KEY,
    title varchar(100),
    song_length INTEGER,
    genre varchar(100),
    artist varchar(100)
);

CREATE TABLE Liked (
    liked_song_id INTEGER references Song(song_id),
    profile_user_id INTEGER references Profiles(profile_id)
);
