create table
player (
id bigint primary key generated always as identity,
fname text,
lname text,
club text,
position text,
baseSalary numeric,
guaranteedComp numeric,
salaryYear int
);