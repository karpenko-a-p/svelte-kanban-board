import { isDate, isRecord, isString } from '@app/core/common';

/**
 * Пользователь системы
 */
export class User {
  /**
   * Создание сущности пользователя
   * @param id - идентификатор
   * @param login - логин
   * @param fio - ФИО
   * @param createdAt - дата создания
   */
  private constructor(
    public id: string,
    public login: string,
    public fio: string,
    public createdAt: Date
  ) {}

  /**
   * Проверка, что сущность расширяет тип User
   * @param entity - проверяемая сущность
   */
  static isExtends(entity: unknown): entity is MoreThan<User> {
    return (
      entity instanceof User ||
      (isRecord(entity) &&
        isString(entity.id) &&
        isString(entity.login) &&
        isString(entity.login) &&
        isString(entity.createAt))
    );
  }

  /**
   * Создание сущности пользователя с проверкой
   * @param id - идентификатор
   * @param login - логин
   * @param fio - ФИО
   * @param createdAt - дата создания
   */
  static new(id: string, login: string, fio: string, createdAt: Date): Maybe<User> {
    if (isString(id) && isString(login) && isString(fio) && isDate(createdAt)) {
      return new User(id, login, fio, createdAt);
    }
  }

  /**
   * Создание пользователя на основе другого пользователя
   * @param user - модель пользователя
   */
  static from(user: User): Maybe<User> {
    if (user instanceof User) {
      return new User(user.id, user.login, user.fio, user.createdAt);
    }
  }

  /**
   * Парсинг сущности к модели пользователя
   * @param entity - приводимая сущность
   */
  static tryParse(entity: unknown): Maybe<User> {
    if (User.isExtends(entity)) {
      return new User(entity.id, entity.login, entity.fio, entity.createdAt);
    }
  }
}
