import { diContainer, err, ok, type Res } from '@app/core/common';
import type { Sprint } from '@app/entities';
import { BackErr, HttpErr } from '@app/http/common-errors';
import { ReqHeaders, request } from '@app/http/utils';
import { CreateSprintDto } from './CreateSprintDto';
import { SprintDto } from './SprintDto';

/**
 * * HTTP клиент для работы с api спринтов
 */
export interface SprintsHttpClient {
  /**
   * Создание нового спринта
   * @param name - название спринта
   * @param startedAt - дата начала спринта
   * @param finishedAt - дата окончания
   * @param boardId - идентификатор канбан доски, к которой будет привязан спринт
   * @returns Спринт или ошибка
   */
  createSprint(
    name: string,
    startedAt: string,
    finishedAt: string,
    boardId: string
  ): Promise<Res<Sprint, BackErr | HttpErr>>;
}

/**
 * @implements {SprintsHttpClient}
 */
export class SprintsHttpClientImpl implements SprintsHttpClient {
  /**
   * @inheritdoc
   * @see {SprintsHttpClient.createSprint}
   */
  async createSprint(
    name: string,
    startedAt: string,
    finishedAt: string,
    boardId: string
  ): Promise<Res<Sprint, BackErr | HttpErr>> {
    const response = await request('/api/v1/boards', {
      method: 'POST',
      headers: ReqHeaders.default().build(),
      body: JSON.stringify(new CreateSprintDto(name, startedAt, finishedAt, boardId))
    });

    // Ошибка сети
    if (response.isErr()) { 
      return err(new HttpErr.Network());
    }

    const smartResponse = response.unwrap();

    // Доска создана
    if (smartResponse.isCreated) {
      const sprint = SprintDto.tryParse(await smartResponse.json());

      if (sprint) {
        return ok(sprint.toSprint());
      }
    }

    return err(new BackErr.Server());
  }
}

/**
 * Регистраация в DI
 */
export const SPRINTS_HTTP_CLIENT = diContainer.register(SprintsHttpClientImpl.name, new SprintsHttpClientImpl());
