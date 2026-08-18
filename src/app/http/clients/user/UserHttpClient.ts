import { diContainer, err, ok, type Res } from '@app/core/common';
import type { User } from '@app/entities';
import { ErrorDto, ValidationErrorDto } from '@app/http/common-dtos';
import { BAD_REQUEST, CREATED, LOGIN_EXISTS } from '@app/http/constants';
import { ReqHeaders } from '@app/http/utils';

import { type RegisterErr, RegisterLoginExistsErr, RegisterServerErr, RegisterValidationErr } from './RegisterErr';
import { UserDto } from './UserDto';

/**
 * HTTP клиент для работы с api пользователей
 */
export interface UserHttpClient {
  /**
   * Регистрация пользователя
   * @param login - логин нового пользователя
   * @param password - пароль нового пользователя
   */
  register(login: string, password: string): Promise<Res<User, RegisterErr>>;
}

/**
 * @implements {UserHttpClient}
 */
class UserHttpClientImpl implements UserHttpClient {
  /**
   * @inheritDoc
   */
  async register(login: string, password: string): Promise<Res<User, RegisterErr>> {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: ReqHeaders.default().build(),
      body: JSON.stringify({ login, password })
    });

    // Пользователь зарегистрирован
    if (response.status === CREATED) {
      const userDto = UserDto.tryParse(await response.json().catch(() => null));

      // Некорректный ответ от бэка
      if (!userDto) {
        return err(new RegisterServerErr());
      }

      return ok(userDto.toUser());
    }

    // Ошибка с клиентской стороны
    if (response.status === BAD_REQUEST) {
      const resDto = await response.json();

      // Ошибка валидации, некорректные данные
      if (ValidationErrorDto.isExtends(resDto)) {
        return err(new RegisterValidationErr(resDto.mistakes));
      }

      // Пользователь с таким логином уже существует или неизвестная ошибка
      return ErrorDto.isExtends(resDto) && resDto.code === LOGIN_EXISTS
        ? err(new RegisterLoginExistsErr())
        : err(new RegisterServerErr());
    }

    // Неизвестная ошибка
    return err(new RegisterServerErr());
  }
}

export const USER_HTTP_CLIENT = diContainer.token('USER_HTTP_CLIENT');

diContainer.set(USER_HTTP_CLIENT, new UserHttpClientImpl());
