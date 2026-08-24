import { Locker } from '@app/core/common';

/**
 * Причина ошибки при создании пользователя
 */
export abstract class LoginErr extends Locker<'LoginErr'> {}

/**
 * Логин уже используется
 */
export class LoginUserNotExistsErr extends LoginErr {}
