-- migrate:up
create table if not exists users
(
    id         bigserial primary key,
    login      text        not null unique check (length(login) >= 6 and length(login) <= 32),
    fio        text        not null check (length(login) >= 5 and length(login) <= 64),
    password   text        not null,
    created_at timestamptz not null default now()
);

-- migrate:down
drop table if exists users;