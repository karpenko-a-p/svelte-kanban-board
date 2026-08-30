import { diContainer, err, ok, type Res } from '@app/core/common';
import { Board } from '@app/entities';
import { type DbBoard, DbUserBoardRole } from './db-entities';
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

    redis.del(`boards-by-user:${ownerId}`);
    redisSet(`board:${dbBoard.id}`, REDIS_HOUR, board);

    return ok(board);
  }

  /**
   * @inheritdoc
   * @see {BoardsRepo.getBoardsByUserId}
   */
  async getBoardsByUserId(userId: string): Promise<Board[]> {
    const cacheKey = `boards-by-user:${userId}`;
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

    redis.del(`boards-by-user:${memberId}`);
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

    redis.del(`boards-by-user:${userId}`);
  }
}

/**
 * Регистрация DI
 */
export const BOARD_REPO = diContainer.register<BoardsRepo>(BoardsRepoImpl.name, new BoardsRepoImpl());
