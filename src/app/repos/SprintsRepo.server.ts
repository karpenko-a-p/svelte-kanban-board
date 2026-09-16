import { diContainer, err, ok, type Res } from '@app/core/common';
import { Sprint } from '@app/entities';
import type { DbSprint } from './db';
import { postgres, REDIS_HOUR, redisGet, redisSet } from './utils';

/**
 * Репозиторий для работы со спринтами
 */
export interface SprintsRepo {
  /**
   * Создание нового спринта
   * @param name - название спринта
   * @param startedAt - дата начала спринта
   * @param finishedAt - дата окончания
   * @param boardId - идентификатор канбан доски, к которой будет привязан спринт
   */
  createSprint(name: string, startedAt: string, finishedAt: string, boardId: string): Promise<Res<Sprint, string>>;

  /**
   * Получения списка спринтов канбан доски
   * @param boardId - идентификатор канбан доски
   */
  getSprintsByBoardId(boardId: string): Promise<Sprint[]>;
}

/**
 * @implements {SprintsRepo}
 */
export class SprintsRepoImpl implements SprintsRepo {
  /**
   * @inheritdoc
   * @see {SprintsRepo.createSprint}
   */
  async createSprint(
    name: string,
    startedAt: string,
    finishedAt: string,
    boardId: string
  ): Promise<Res<Sprint, string>> {
    const [row] = await postgres<DbSprint[]>`
      insert into sprints (name, started_at, finished_at, board_id)
      values (${name}, ${startedAt}, ${finishedAt}, ${boardId})
      returning id, name, started_at, finished_at, board_id`;

    const sprint = Sprint.new(row.id, row.name, row.started_at.toISOString(), row.finished_at.toISOString());

    if (!sprint) {
      return err('Ошибка приведения сущности DbSprint к модели Sprint');
    }

    redisSet(`sprint:${sprint.id}`, REDIS_HOUR, sprint);
    return ok(sprint);
  }

  /**
   * @inheritdoc
   * @see {SprintsRepo.getSprintsByBoardId}
   */
  async getSprintsByBoardId(boardId: string): Promise<Sprint[]> {
    const cacheKey = `sprints_by_board:${boardId}`;
    const cachedSprints = await redisGet<Sprint[]>(cacheKey);

    if (cachedSprints !== undefined) {
      return cachedSprints?.map(Sprint.tryParse).removeNil() ?? [];
    }

    const rows = await postgres<DbSprint[]>`
      select id, name, started_at, finished_at from sprints
      where board_id = ${boardId}`;

    const sprints = rows.map(Sprint.tryParse).removeNil();

    redisSet(cacheKey, REDIS_HOUR, sprints);
    return sprints;
  }
}

/**
 * Регистрация DI
 */
export const SPRINTS_REPO = diContainer.register<SprintsRepo>(SprintsRepoImpl.name, new SprintsRepoImpl());
