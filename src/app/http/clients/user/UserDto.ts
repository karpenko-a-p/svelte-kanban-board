import { isRecord, isString, panic } from '@app/core/common';
import { User } from '@app/entities';

/**
 * DTO пользователя
 */
export class UserDto {
  /**
   * Создание DTO Пользователя
   * @param id - идентификатор
   * @param login - логин
   * @param fio - ФИО
   * @param createdAt - дата создания
   */
  constructor(
    readonly id: string,
    readonly login: string,
    readonly fio: string,
    readonly createdAt: string
  ) {}

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   * @returns DTO если получилось привести, ничего если нет
   */
  static tryParse(dto: unknown): Maybe<UserDto> {
    if (isRecord(dto) && isString(dto.id) && isString(dto.login) && isString(dto.fio) && isString(dto.createdAt)) {
      return new UserDto(dto.id, dto.login, dto.fio, dto.createdAt);
    }
  }

  /**
   * Парсинг сущности пользователя к DTO пользователя
   * @param user - сущность пользователя
   */
  static fromUser(user: User): UserDto {
    return new UserDto(user.id, user.login, user.fio, user.createdAt);
  }

  /**
   * Приведение DTO к сущности пользователя
   * @returns сущность пользователя
   */
  toUser(): User {
    return (
      User.new(this.id, this.login, this.fio, this.createdAt) ??
      panic('Не удалось создать сущность пользователя из DTO пользователя')
    );
  }
}
