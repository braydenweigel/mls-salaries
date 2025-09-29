create table Players (
    PlayerID char(6) primary key unique not null,
    FirstName text default '',
    LastName text default ''
);