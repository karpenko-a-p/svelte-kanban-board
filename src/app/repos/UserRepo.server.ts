import { diContainer } from '@app/core/common';
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
   */
  createUser(login: string, fio: string, password: string): Promise<Maybe<User>>;

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
}

/**
 * @implements {UserRepo}
 */
class UserRepoImpl implements UserRepo {
  /**
   * @inheritDoc
   */
  async createUser(login: string, fio: string, password: string): Promise<Maybe<User>> {
    const [row = null] = await postgres<[DbUser]>`
      insert into users (login, fio, password)
      values (${login}, ${fio}, ${password})
      returning id, login, fio, created_at`;

    const user = row && User.new(row.id, row.login, row.fio, row.created_at);

    if (!user) {
      return null;
    }

    redisSet(`user:${user.id}`, REDIS_HOUR, user);
    return user;
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
}

/**
 * Регистрация в DI
 */
export const USER_REPO = diContainer.register(UserRepoImpl.name, new UserRepoImpl());
