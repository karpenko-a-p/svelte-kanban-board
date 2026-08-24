import { Locker } from '@app/core/common';

/**
 * Причина ошибки при создании пользователя
 */
export abstract class RegisterErr extends Locker<'RegisterErr'> {}

/**
 * Логин уже используется
 */
export class RegisterUserExistsErr extends RegisterErr {}
