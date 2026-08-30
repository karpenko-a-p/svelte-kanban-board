import { diContainer, err, ok, type Res } from '@app/core/common';
import { User } from '@app/entities';
import type { DbUser } from '@app/repos/db-entities';
import { postgres, REDIS_HOUR, redisGet, redisSet } from '@app/repos/utils';

/**
 * Репозиторий для работы с пользователями
 */
export interface UserRepo {
  /**
   * Создание пользователя
   * @param login - логин нового пользователя
   * @param fio - ФИО нового пользователя
   * @param password - пароль нового пользователя
   * @returns новый пользователь или соообщение о внутренней ошибке
   */
  createUser(login: string, fio: string, password: string): Promise<Res<User, string>>;

  /**
   * Проверка существования пользователя по логину
   * @param login - логин пользователя
   */
  checkUserExistsByLogin(login: string): Promise<boolean>;

  /**
   * Получение пользователя по идентификатору
   * @param id - идентификатор пользователя
   */
  getUserById(id: string): Promise<Maybe<User>>;

  /**
   * Получение пользователя по логину
   * @param login - логин пользователя
   */
  getUserByLogin(login: string): Promise<Maybe<User>>;

  /**
   * Получение пароля пользователя по его идентификатору
   * @param login - логин пользователя
   */
  getUserPasswordByLogin(login: string): Promise<Maybe<string>>;
}

/**
 * @implements {UserRepo}
 */
class UserRepoImpl implements UserRepo {
  /**
   * @inheritDoc
   */
  async createUser(login: string, fio: string, password: string): Promise<Res<User, string>> {
    const [row] = await postgres<DbUser[]>`
      insert into users (login, fio, password)
      values (${login}, ${fio}, ${password})
      returning id, login, fio, created_at`;

    const user = User.new(row.id, row.login, row.fio, row.created_at);

    if (!user) {
      return err('Ошибка приведения сущности DbUser к модели User');
    }

    redisSet(`user:${user.id}`, REDIS_HOUR, user);

    return ok(user);
  }

  /**
   * @inheritDoc
   */
  async checkUserExistsByLogin(login: string): Promise<boolean> {
    const [row = null] = await postgres<[{ exists: boolean }]>`
      select 1::bool as exists
      from users
      where login = ${login}
      limit 1`;

    return !!row?.exists;
  }

  /**
   * @inheritDoc
   */
  async getUserById(id: string): Promise<Maybe<User>> {
    const cacheKey = `user:${id}`;
    const cachedUser = await redisGet<User>(cacheKey);

    if (cachedUser !== undefined) {
      return cachedUser && User.tryParse(cachedUser);
    }

    const [row = null] = await postgres<[DbUser]>`
      select id, login, fio, created_at
      from users
      where id = ${id}
      limit 1`;

    const user = row && User.new(row.id, row.login, row.fio, row.created_at);

    redisSet(cacheKey, REDIS_HOUR, user);
    return user;
  }

  /**
   * @inheritDoc
   */
  async getUserByLogin(login: string): Promise<Maybe<User>> {
    const [row = null] = await postgres<[DbUser]>`
      select id, login, fio, created_at
      from users
      where login = ${login}
      limit 1`;

    const user = row && User.new(row.id, row.login, row.fio, row.created_at);

    user && redisSet(`user:${user.id}`, REDIS_HOUR, user);

    return user;
  }

  /**
   * @inheritDoc
   */
  async getUserPasswordByLogin(login: string): Promise<Maybe<string>> {
    const [row = null] = await postgres<[DbUser]>`
      select password
      from users
      where login = ${login}
      limit 1`;

    return row?.password;
  }
}

/**
 * Регистрация в DI
 */
export const USER_REPO = diContainer.register(UserRepoImpl.name, new UserRepoImpl());
