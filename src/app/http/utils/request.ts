import { err, ok, type Res } from '#app/core/common';
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  FOUND,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY
} from '#app/http/constants';

/**
 * Расширение стандартного ответа Response
 * @description включает методы для расширения функциональности ответа от fetch
 */
class SmartResponse extends Response {
  /**
   * Проверка статуса на OK
   */
  get isOk(): boolean {
    return this.status === OK;
  }

  /**
   * Проверка статуса на CREATED
   */
  get isCreated(): boolean {
    return this.status === CREATED;
  }

  /**
   * Проверка статуса на FOUND
   */
  get isFound(): boolean {
    return this.status === FOUND;
  }

  /**
   * Проверка статуса на BAD_REQUEST
   */
  get isBadRequest(): boolean {
    return this.status === BAD_REQUEST;
  }

  /**
   * Проверка статуса на NOT_FOUND
   */
  get isNotFound(): boolean {
    return this.status === NOT_FOUND;
  }

  /**
   * Проверка статуса на UNAUTHORIZED
   */
  get isUnauthorized(): boolean {
    return this.status === UNAUTHORIZED;
  }

  /**
   * Проверка статуса на FORBIDDEN
   */
  get isForbidden(): boolean {
    return this.status === FORBIDDEN;
  }

  /**
   * Проверка статуса на UNPROCESSABLE_ENTITY
   */
  get isUnprocessableEntity(): boolean {
    return this.status === UNPROCESSABLE_ENTITY;
  }

  /**
   * Проверка статуса на INTERNAL_SERVER_ERROR
   */
  get isInternalServerError(): boolean {
    return this.status === INTERNAL_SERVER_ERROR;
  }

  /**
   * Возврат результата парсинга тела ответа в json
   * @see {parseJson}
   */
  override json(): Promise<unknown> {
    return super.json().catch(() => null);
  }
}

/**
 * Причина ошибки во время выполнения запроса
 */
export const enum RequestErr {
  /**
   * Ошибка сети
   */
  HttpErr,
  /**
   * Запрос прерван
   */
  CanceledErr
}

/**
 * Отправка http запроса
 * @description является оберткой над fetch, расширяет функциональность
 * @param input - адрес запроса
 * @param init - данные для формирования запроса
 * @returns расширенный ответ или причину ошибки (падения запроса)
 */
export async function request(input: string | URL, init: RequestInit): Promise<Res<SmartResponse, RequestErr>> {
  try {
    const response = await fetch(input, init);
    return ok(new SmartResponse(response.body, response));
  } catch (error: unknown) {
    return error instanceof Error && error.name === 'AbortError'
      ? err(RequestErr.CanceledErr)
      : err(RequestErr.HttpErr);
  }
}
