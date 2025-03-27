create table
team (
id bigint primary key generated always as identity,
teamName text,
logoUrl text,
colorPrimary text,
colorSecondary text,
colorThird text,
created_at timestamptz default now()
);