import { diContainer, err, ok, type Res } from '#app/core/common';
import { Board, User } from '#app/entities';
import { type DbBoard, type DbUser, DbUserBoardRole } from './db';
import { postgres, redis, REDIS_HOUR, redisGet, redisSet } from './utils';

/**
 * Роль пользователя для канбан доски
 */
export const enum UserBoardRole {
  /**
   * Участник
   */
  Member = 'Member',
  /**
   * Владелец
   */
  Owner = 'Owner'
}

/**
 * Репозиторий для работы с канбан досками
 */
export interface BoardsRepo {
  /**
   * Создание канбан доски
   * @param name - имя доски
   * @param description - описание доски
   * @param ownerId - Владелец канбан доски
   * @returns Данные созданой доски или сообщение об ошибке
   */
  createBoard(name: string, description: string, ownerId: string): Promise<Res<Board, string>>;

  /**
   * Получение списка досок определенного пользователя
   * @param userId - идентификатор пользователя
   * @returns список досок
   */
  getBoardsByUserId(userId: string): Promise<Board[]>;

  /**
   * Получение данных доски по идентификатору
   * @param id - идентификатор доски
   * @returns канбан доска, если существует
   */
  getBoardById(id: string): Promise<Maybe<Board>>;

  /**
   * Добавление участника к канбан доске
   * @param boardId - идентификатор доски
   * @param userId - идентификатор участника (пользователя)
   * @param role - идентификатор участника (пользователя)
   */
  addMemberToBoard(boardId: string, userId: string, role: UserBoardRole): Promise<void>;

  /**
   * Удалить участника bp канбан доски
   * @param boardId - идентификатор доски
   * @param userId - идентификатор участника (пользователя)
   */
  removeMemberFromBoard(boardId: string, userId: string): Promise<void>;

  /**
   * Проверка досутпа пользователя к доске
   * @param userId - идентифкиатор проверяемого пользователя
   * @returns флаг наличия доступа
   */
  checkIsMember(boardId: string, userId: string): Promise<boolean>;

  /**
   * Получение списка участников доски
   * @param boardId - идентификатор доски
   * @returns массив пользователей
   */
  getMembers(boardId: string): Promise<User[]>;

  /**
   * Провверка что спринт принадлежит к определенной доске
   * @param boardId - идентификатор канбан доски
   * @param sprintId - идентификатор спринта
   * @returns статус принадлежности
   */
  checkBoardOwnsSprint(boardId: string, sprintId: string): Promise<boolean>;

  /**
   * Провверка что задача принадлежит к определенной доске
   * @param boardId - идентификатор канбан доски
   * @param taskId - идентификатор задачи
   * @returns статус принадлежности
   */
  checkBoardOwnsTask(boardId: string, taskId: string): Promise<boolean>;
}

/**
 * @implements {BoardsRepo}
 */
export class BoardsRepoImpl implements BoardsRepo {
  /**
   * @inheritdoc
   * @see {BoardsRepo.createBoard}
   */
  async createBoard(name: string, description: string, ownerId: string): Promise<Res<Board, string>> {
    const dbBoard = await postgres.transaction(async (sql) => {
      // Создание новой канбан доски
      const [row] = await sql<DbBoard[]>`
        insert into boards (name, description)
        values(${name}, ${description})
        returning id, name, description`;

      // Добавление пользователя к доске как владельца
      await sql`
        insert into boards_members (board_id, user_id, user_role)
        values (${row.id}, ${ownerId}, ${DbUserBoardRole.Owner})`;

      return row;
    });

    const board = Board.tryParse(dbBoard);

    if (!board) {
      return err('Ошибка приведения сущности DbBoard к модели Board');
    }

    redis.del(`boards_by_user:${ownerId}`);
    redisSet(`board:${dbBoard.id}`, REDIS_HOUR, board);

    return ok(board);
  }

  /**
   * @inheritdoc
   * @see {BoardsRepo.getBoardsByUserId}
   */
  async getBoardsByUserId(userId: string): Promise<Board[]> {
    const cacheKey = `boards_by_user:${userId}`;
    const cachedBoards = await redisGet<Board[]>(cacheKey);

    if (cachedBoards !== undefined) {
      return cachedBoards?.map(Board.tryParse).removeNil() ?? [];
    }

    // Получение всех канбан досок в которых состоят пользователь
    const rows = await postgres<DbBoard[]>`
      select b.id, b.name, b.description from boards b
      join boards_members bm on b.id = bm.board_id
      where bm.user_id = ${userId}`;

    const boards = rows.map(Board.tryParse).removeNil();

    redisSet(cacheKey, REDIS_HOUR, boards);
    return boards;
  }

  /**
   * @inheritdoc
   * @see {BoardsRepo.getBoardById}
   */
  async getBoardById(id: string): Promise<Maybe<Board>> {
    const cacheKey = `board:${id}`;
    const cachedBoard = await redisGet<Board[]>(cacheKey);

    if (cachedBoard !== undefined) {
      return Board.tryParse(cachedBoard);
    }

    const [row = null] = await postgres`
      select id, name, description from boards
      where id = ${id}
      limit 1`;

    const board = Board.tryParse(row);

    redisSet(cacheKey, REDIS_HOUR, board);
    return board;
  }

  /**
   * @inheritdoc
   * @see {BoardsRepo.addMemberToBoard}
   */
  async addMemberToBoard(boardId: string, memberId: string, role: UserBoardRole): Promise<void> {
    // Маппинг роли из контракта и из БД
    const dbRole: DbUserBoardRole = {
      [UserBoardRole.Member]: DbUserBoardRole.Member,
      [UserBoardRole.Owner]: DbUserBoardRole.Owner
    }[role];

    // Создание связи пользователя и таблицы
    await postgres`
      insert into boards_members (board_id, user_id, user_role)
      values (${boardId}, ${memberId}, ${dbRole})`;

    redis.del(`boards_by_user:${memberId}`);
  }

  /**
   * @inheritdoc
   * @see {BoardsRepo.removeMemberFromBoard}
   */
  async removeMemberFromBoard(boardId: string, userId: string): Promise<void> {
    await postgres.transaction(async (sql) => {
      // Удаление связи пользователя и таблицы
      await sql`
        delete from boards_members
        where user_id = ${userId} and board_id = ${boardId}`;

      // Очистка "Назначенного" для задач, у которых в качетсве "Назначенного" был текущий пользователь
      await sql`
        update tasks t
        set assigned_id = NULL
        from sprints s
        join boards b on s.board_id = b.id
        where t.sprint_id = s.id
        and t.assigned_id = ${userId}
        and b.board_id = ${boardId} `;
    });

    redis.del(`boards_by_user:${userId}`);
  }

  /**
   * @inheritdoc
   * @see {BoardsRepo.checkIsMember}
   */
  async checkIsMember(boardId: string, userId: string): Promise<boolean> {
    const cacheKey = `board:${boardId}_has_user:${userId}`;

    const cachedVal = await redisGet<boolean>(cacheKey);

    if (cachedVal !== undefined) {
      return !!cachedVal;
    }

    const [row = null] = await postgres<[{ is_member: boolean }]>`
      select 1::bool as is_member from boards_members
      where board_id = ${boardId} and user_id = ${userId}
      limit 1`;

    const isMember = !!row?.is_member;

    redisSet(cacheKey, REDIS_HOUR, isMember);

    return isMember;
  }

  /**
   * @inheritdoc
   * @see {BoardsRepo.getMembers}
   */
  async getMembers(boardId: string): Promise<User[]> {
    const cacheKey = `users_by_board:${boardId}`;
    const cachedVal = await redisGet<User[]>(cacheKey);

    if (cachedVal !== undefined) {
      return cachedVal?.map(User.tryParse).removeNil() ?? [];
    }

    const rows = await postgres<DbUser[]>`
      select id, login, fio, created_at from users u
      join boards_members bm on bm.user_id = u.id
      where bm.board_id = ${boardId}`;

    const users = rows
      .map((user) => User.new(user.id, user.login, user.fio, user.created_at.toISOString()))
      .removeNil();

    redisSet(cacheKey, REDIS_HOUR, users);
    return users;
  }

  /**
   * @inheritdoc
   * @see {BoardsRepo.checkBoardOwnsSprint}
   */
  async checkBoardOwnsSprint(boardId: string, sprintId: string): Promise<boolean> {
    const [row = null] = await postgres<[{ owns: boolean }]>`
      select 1::bool as owns from boards b
      join sprints s on b.id = s.board_id
      where b.id = ${boardId} and s.id = ${sprintId}
      limit 1`;

    return !!row?.owns;
  }

  /**
   * @inheritdoc
   * @see {BoardsRepo.checkBoardOwnsTask}
   */
  async checkBoardOwnsTask(boardId: string, taskId: string): Promise<boolean> {
    const [row = null] = await postgres<[{ owns: boolean }]>`
      select 1::bool as owns from boards b
      join sprints s on b.id = s.board_id
      join tasks t on t.sprint_id = s.id
      where b.id = ${boardId} and t.id = ${taskId}
      limit 1`;

    return !!row?.owns;
  }
}

/**
 * Регистрация DI
 */
export const BOARDS_REPO = diContainer.register<BoardsRepo>(BoardsRepoImpl.name, new BoardsRepoImpl());
