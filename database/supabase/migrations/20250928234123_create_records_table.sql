create table Records (
    RecordID char(8) primary key unique not null,
    PlayerID char(6) not null,
    Club varchar(5) not null,
    Position text default '',
    BaseSalary numeric(12,2),
    GuaranteedComp numeric(12,2),
    RecordYear text,
    constraint fk_player
        foreign key (PlayerID)
        references Players(PlayerID),
    constraint fk_club
        foreign key (Club)
        references Clubs(ClubID)
);