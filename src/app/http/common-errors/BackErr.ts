import { Locker } from '@app/core/common';

/**
 * Общие ошибки сервера (backend приложения)
 */
export abstract class BackErr extends Locker<'BackErr'> {}

/**
 * Внутренняя ошибка сервера
 */
export class ServerErr extends BackErr {}

/**
 * Был передан некорректный формат данных
 */
export class InvalidEntityErr extends BackErr {}

/**
 * Ошибка валидации
 */
export class RegisterValidationErr extends BackErr {
  /**
   * Создание причины ошибки из-за валидации
   * @param errors - список ошибок валидации
   */
  constructor(readonly errors: string[]) {
    super();
  }
}
