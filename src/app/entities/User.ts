import { isRecord, isString, type ToPlain } from '@app/core/common';

/**
 * Пользователь системы
 */
export class User implements ToPlain {
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
    public createdAt: string
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
        isString(entity.createdAt))
    );
  }

  /**
   * Создание сущности пользователя с проверкой
   * @param id - идентификатор
   * @param login - логин
   * @param fio - ФИО
   * @param createdAt - дата создания
   */
  static new(id: string, login: string, fio: string, createdAt: string): Maybe<User> {
    if (isString(id) && isString(login) && isString(fio) && isString(createdAt)) {
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

  /**
   * @inheritDoc
   */
  toPlain(): Record<string, unknown> {
    return {
      id: this.id,
      login: this.login,
      fio: this.fio,
      createdAt: this.createdAt
    };
  }
}
