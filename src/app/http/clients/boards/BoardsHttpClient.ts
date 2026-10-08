import { diContainer, err, ok, type Res } from '#app/core/common';
import { Board } from '#app/entities';
import { InvalidEntityErrorDto, ValidationErrorDto } from '#app/http/common-dtos';
import { BackErr, HttpErr } from '#app/http/common-errors';
import { ReqHeaders, request } from '#app/http/utils';
import { BoardDto } from './BoardDto';
import { CreateBoardDto } from './CreateBoardDto';

/**
 * HTTP клиент для работы с api канбан досок
 */
export interface BoardsHttpClient {
  /**
   * Создание канбан доски
   * @param name - имя доски
   * @param description - описание доски
   * @param ownerId - Владелец канбан доски
   * @returns Данные созданой доски или сообщение об ошибке
   */
  createBoard(name: string, description: string, ownerId: string): Promise<Res<Board, HttpErr | BackErr>>;

  /**
   * Получение досок в которых состоит пользоваатель
   * @param userId - идентификатор пользователя
   * @returns Список досок
   */
  getBoardsByUserId(userId: string): Promise<Res<Board[], HttpErr | BackErr>>;
}

/**
 * @implements {BoardsHttpClient}
 */
class BoardsHttpClientImpl implements BoardsHttpClient {
  /**
   * @inheritdoc
   * @see {BoardsHttpClient.createBoard}
   */
  async createBoard(name: string, description: string): Promise<Res<Board, HttpErr | BackErr>> {
    const response = await request('/api/v1/boards', {
      method: 'POST',
      headers: ReqHeaders.default().build(),
      body: JSON.stringify(new CreateBoardDto(name, description))
    });

    // Ошибка сети
    if (response.isErr()) {
      return err(new HttpErr.Network());
    }

    const smartResponse = response.unwrap();

    // Данные созданой доски
    if (smartResponse.isCreated) {
      const boardDto = BoardDto.tryParse(await smartResponse.json());

      // Создана новая канбан доска
      if (boardDto) {
        return ok(boardDto.toBoard());
      }
    }

    // Передано некорректное DTO
    else if (smartResponse.isUnprocessableEntity && InvalidEntityErrorDto.isExtends(await smartResponse.json())) {
      return err(new BackErr.InvalidEntity());
    }

    // Ошибка валидации
    if (smartResponse.isBadRequest) {
      const responseDto = await smartResponse.json();

      if (ValidationErrorDto.isExtends(responseDto)) {
        return err(new BackErr.Validation(responseDto.issues));
      }
    }

    // Неизвестная ошибка
    return err(new BackErr.Server());
  }

  /**
   * @inheritdoc
   * @see {BoardsHttpClient.getBoardsByUserId}
   */
  async getBoardsByUserId(): Promise<Res<Board[], HttpErr | BackErr>> {
    const response = await request('/api/v1/board', {
      method: 'GET',
      headers: ReqHeaders.default().build()
    });

    // Ошибка сети
    if (response.isErr()) {
      return err(new HttpErr.Network());
    }

    const smartResponse = response.unwrap();

    // Данные по доскам пользователя получены
    if (smartResponse.isOk) {
      const responseBody = await smartResponse.json();

      // Бэк вернул некорректный ответ
      if (!responseBody || !Array.isArray(responseBody)) {
        return err(new BackErr.Server());
      }

      return ok(responseBody.map(Board.tryParse).removeNil());
    }

    // Неизвестная ошибка
    return err(new BackErr.Server());
  }
}

/**
 * Регистраация в DI
 */
export const BOARDS_HTTP_CLIENT = diContainer.register(BoardsHttpClientImpl.name, new BoardsHttpClientImpl());
