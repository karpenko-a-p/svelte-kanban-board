-- migrate:up
create table if not exists users
(
    id         bigserial primary key,
    login      text        not null unique check (length(login) >= 6 and length(login) <= 32),
    fio        text        not null check (length(login) >= 5 and length(login) <= 64),
    password   text        not null,
    created_at timestamptz not null default now()
);

create table if not exists boards
(
    id          bigserial primary key,
    name        text not null check (length(name) >= 6 and length(name) <= 64),
    description text not null
);

create type user_board_role as enum ('Owner', 'Member');

create table if not exists boards_members
(
    board_id  bigint          not null references boards (id) on delete cascade,
    user_id   bigint          not null references users (id) on delete cascade,
    user_role user_board_role not null,
    primary key (board_id, user_id)
);

create table if not exists sprints
(
    id          bigserial primary key,
    name        text        not null check (length(name) <= 64),
    started_at  timestamptz not null,
    finished_at timestamptz not null,
    board_id    bigint      not null references boards (id) on delete cascade
);

create type task_status as enum ('NotStarted', 'InProgress', 'Done');

create type task_priority as enum ('Low', 'Medium', 'High');

create table if not exists tasks
(
    id          bigserial primary key,
    name        text          not null check (length(name) <= 64),
    description text,
    status      task_status   not null default 'NotStarted',
    priority    task_priority not null default 'Medium',
    sprint_id   bigint        not null references sprints (id) on delete cascade,
    reporter_id bigint        references users (id) on delete set null,
    assigned_id bigint        references users (id) on delete set null
);

create table if not exists comments
(
    id      bigserial primary key,
    content text,
    task_id bigint not null references tasks (id) on delete cascade,
    user_id bigint references users (id) on delete set null
);

-- migrate:down
drop table if exists comments;

drop table if exists tasks;

drop type if exists task_priority;

drop type if exists task_status;

drop table if exists sprints;

drop table if exists boards_members;

drop type if exists user_board_role;

drop table if exists boards;

drop table if exists users;
