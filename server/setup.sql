CREATE TABLE IF NOT EXISTS Profiles (
    profile_id INTEGER PRIMARY KEY,
    profile_name varchar(20),
    profile_password varchar(20)
);

CREATE TABLE IF NOT EXISTS Song (
    song_id INTEGER PRIMARY KEY,
    title varchar(100),
    song_length INTEGER,
    artist varchar(100)
);

CREATE TABLE IF NOT EXISTS Liked (
    liked_song_id INTEGER REFERENCES Song(song_id),
    profile_user_id INTEGER REFERENCES Profiles(profile_id)
);