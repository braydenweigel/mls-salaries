create table PlayerRecords (
    id char(8) primary key unique not null,
    playerid char(6) not null,
    firstname text,
    lastname text,
    club varchar(5) not null,
    position text default '',
    basesalary numeric(12,2),
    guaranteedcomp numeric(12,2),
    recordyear text,
    recordseason text,
    constraint fk_player
        foreign key (playerid)
        references Players(playerid),
    constraint fk_club
        foreign key (Club)
        references Clubs(ClubID)
);