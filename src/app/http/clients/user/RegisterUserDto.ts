import { isRecord, isString, type Validate } from '@app/core/common';

/**
 * DTO данных для регистрации пользователя
 */
export class RegisterUserDto implements Validate {
  /**
   * Создание DTO для регистрации пользователя
   * @param login - логин пользователя
   * @param fio - ФИО пользователя
   * @param password - пароль пользователя
   */
  private constructor(
    readonly login: string,
    readonly fio: string,
    readonly password: string
  ) {}

  /**
   * Создание DTO для регистрации пользователя
   * @param login - логин пользователя
   * @param fio - ФИО пользователя
   * @param password - пароль пользователя
   */
  static new(login: string, fio: string, password: string): Maybe<RegisterUserDto> {
    if (isString(login) && isString(fio) && isString(password)) {
      return new RegisterUserDto(login, fio, password);
    }
  }

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<RegisterUserDto> {
    if (isRecord(dto) && isString(dto.login) && isString(dto.fio) && isString(dto.password)) {
      return new RegisterUserDto(dto.login, dto.fio, dto.password);
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

    if (this.fio.length < 5 || this.fio.length > 64) {
      errors.push('ФИО должно быть от 6 до 32 символов включительно');
    }

    if (this.fio.length < 6 || this.fio.length > 128) {
      errors.push('Пароль доложен быть от 6 до 32 символов включительно');
    }

    return errors;
  }
}
