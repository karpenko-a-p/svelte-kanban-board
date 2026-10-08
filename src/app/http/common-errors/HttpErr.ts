import { Locker } from '#app/core/common';

/**
 * HTTP ошибка при выполнении запроса
 */
export abstract class HttpErr extends Locker<'HttpErr'> {
  /**
   * Ошибка сети во время выполнения запроса
   */
  static readonly Network = class extends HttpErr {};

  /**
   * Запрос был завершен до получения ответа
   */
  static readonly Canceled = class extends HttpErr {};
}
