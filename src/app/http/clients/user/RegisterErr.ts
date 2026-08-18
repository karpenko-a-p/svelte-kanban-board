/**
 * Причина ошибки при создании пользователя
 */
export interface RegisterErr {}

/**
 * Ошибка валидации
 */
export class RegisterValidationErr implements RegisterErr {
  /**
   * Создание причины ошибки из-за валидации
   * @param errors - список ошибок валидации
   */
  constructor(readonly errors: string[]) {}
}

/**
 * Логин уже используется
 */
export class RegisterLoginExistsErr implements RegisterErr {}

/**
 * Внутренняя ошибка сервера
 */
export class RegisterServerErr implements RegisterErr {}
