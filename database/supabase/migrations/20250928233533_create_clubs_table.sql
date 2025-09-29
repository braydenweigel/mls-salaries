create table Clubs (
    ClubName text unique not null,
    ClubID varchar(5) primary key unique not null,
    YearFirst text not null,
    YearFinal text not null,
    ColorPrimary text not null,
    ColorSecondary text not null
);