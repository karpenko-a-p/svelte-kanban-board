import { Locker } from '#app/core/common';

/**
 * Причина ошибки при создании пользователя
 */
export abstract class LoginErr extends Locker<'LoginErr'> {
  /**
   * Логин уже используется
   */
  static readonly UserNotExists = class extends LoginErr {};
}
