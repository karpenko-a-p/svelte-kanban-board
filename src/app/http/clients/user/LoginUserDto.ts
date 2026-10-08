import { isRecord, isString, type Validate } from '#app/core/common';

/**
 * DTO данных для авторизации пользователя
 */
export class LoginUserDto implements Validate {
  /**
   * Создание DTO для регистрации пользователя
   * @param login - логин пользователя
   * @param password - пароль пользователя
   */
  constructor(
    readonly login: string,
    readonly password: string
  ) {}

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<LoginUserDto> {
    if (isRecord(dto) && isString(dto.login) && isString(dto.password)) {
      return new LoginUserDto(dto.login, dto.password);
    }
  }

  /**
   * @inheritDoc
   */
  validate(): string[] {
    const errors = [];

    if (this.login.length < 6 || this.login.length > 32) {
      errors.push('Логин должен быть от 6 до 32 символов включительно');
    }

    if (this.password.length < 6 || this.password.length > 128) {
      errors.push('Пароль доложен быть от 6 до 128 символов включительно');
    }

    return errors;
  }
}
