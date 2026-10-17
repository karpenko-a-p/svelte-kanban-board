import { Locker } from '#app/core/common';

/**
 * Общие ошибки сервера (backend приложения)
 */
export abstract class BackErr extends Locker<'BackErr'> {
  /**
   * Внутренняя ошибка сервера
   */
  static readonly Server = class extends BackErr {};

  /**
   * Был передан некорректный формат данных
   */
  static readonly InvalidEntity = class extends BackErr {};

  /**
   * Не найдено
   */
  static readonly NotFound = class extends BackErr {};

  /**
   * Ошибка валидации
   */
  static readonly Validation = class extends BackErr {
    /**
     * Создание причины ошибки из-за валидации
     * @param errors - список ошибок валидации
     */
    constructor(readonly errors: string[]) {
      super();
    }
  };

  /**
   * Не авторизован
   */
  static readonly Unauthorized = class extends BackErr {};

  /**
   * Недостаточно прав
   */
  static readonly Forbidden = class extends BackErr {};
}
