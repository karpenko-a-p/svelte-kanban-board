import { diContainer, err, ok, type Res } from '@app/core/common';
import type { User } from '@app/entities';
import { ErrorDto, InvalidEntityErrorDto, ValidationErrorDto } from '@app/http/common-dtos';
import { type BackErr, type HttpErr, InvalidEntityErr, NetworkErr } from '@app/http/common-errors';
import { RegisterValidationErr, ServerErr } from '@app/http/common-errors';
import { USER_EXISTS, USER_NOT_EXISTS } from '@app/http/constants';
import { ReqHeaders, request } from '@app/http/utils';

import { type LoginErr, LoginUserNotExistsErr } from './LoginErr';
import { LoginUserDto } from './LoginUserDto';
import { type RegisterErr, RegisterUserExistsErr } from './RegisterErr';
import { RegisterUserDto } from './RegisterUserDto';
import { UserDto } from './UserDto';

/**
 * HTTP клиент для работы с api пользователей
 */
export interface UserHttpClient {
  /**
   * Регистрация пользователя
   * @param login - логин нового пользователя
   * @param fio - ФИО нового пользователя
   * @param password - пароль нового пользователя
   */
  register(login: string, fio: string, password: string): Promise<Res<User, RegisterErr | BackErr | HttpErr>>;

  /**
   * Авторизация пользователя
   * @param login - логин пользователя
   * @param password - пароль пользователя
   */
  login(login: string, password: string): Promise<Res<User, LoginErr | BackErr | HttpErr>>;

  /**
   * Выход из системы
   * @description Удаление авторизационной куки
   */
  logout(): Promise<Res<null, BackErr | HttpErr>>;
}

/**
 * @implements {UserHttpClient}
 */
class UserHttpClientImpl implements UserHttpClient {
  /**
   * @inheritDoc
   */
  async register(login: string, fio: string, password: string): Promise<Res<User, RegisterErr | BackErr | HttpErr>> {
    const response = await request('/api/v1/auth/register', {
      method: 'POST',
      headers: ReqHeaders.default().build(),
      body: JSON.stringify(RegisterUserDto.new(login, fio, password))
    });

    // Ошибка сети
    if (response.isErr()) {
      return err(new NetworkErr());
    }

    const smartResponse = response.unwrap();

    // Пользователь зарегистрирован
    if (smartResponse.isCreated) {
      const userDto = UserDto.tryParse(await smartResponse.json());

      if (userDto) {
        return ok(userDto.toUser());
      }
    }

    // Передано некорректное DTO
    else if (smartResponse.isUnprocessableEntity && InvalidEntityErrorDto.isExtends(await smartResponse.json())) {
      return err(new InvalidEntityErr());
    }

    // Ошибка с клиентской стороны
    else if (smartResponse.isBadRequest) {
      const responseDto = await smartResponse.json();

      // Ошибка валидации, некорректные данные
      if (ValidationErrorDto.isExtends(responseDto)) {
        return err(new RegisterValidationErr(responseDto.mistakes));
      }

      // Пользователь с таким логином уже существует
      if (ErrorDto.isExtends(responseDto) && responseDto.code === USER_EXISTS) {
        return err(new RegisterUserExistsErr());
      }
    }

    // Неизвестная ошибка
    return err(new ServerErr());
  }

  /**
   * @inheritDoc
   */
  async login(login: string, password: string): Promise<Res<User, LoginErr | BackErr | HttpErr>> {
    const response = await request('/api/v1/auth/login', {
      method: 'POST',
      headers: ReqHeaders.default().build(),
      body: JSON.stringify(LoginUserDto.new(login, password))
    });

    // Ошибка сети
    if (response.isErr()) {
      return err(new NetworkErr());
    }

    const smartResponse = response.unwrap();

    // Пользователь авторизован
    if (smartResponse.isOk) {
      const userDto = UserDto.tryParse(await smartResponse.json());

      if (userDto) {
        return ok(userDto.toUser());
      }
    }

    // Передано некорректное DTO
    else if (smartResponse.isUnprocessableEntity && InvalidEntityErrorDto.isExtends(await smartResponse.json())) {
      return err(new InvalidEntityErr());
    }

    // Ошибка с клиентской стороны
    else if (smartResponse.isBadRequest) {
      const responseDto = await smartResponse.json();

      // Ошибка валидации, некорректные данные
      if (ValidationErrorDto.isExtends(responseDto)) {
        return err(new RegisterValidationErr(responseDto.mistakes));
      }

      // Пользователь с таким логином не существует
      if (ErrorDto.isExtends(responseDto) && responseDto.code === USER_NOT_EXISTS) {
        return err(new LoginUserNotExistsErr());
      }
    }

    // Неизвестная ошибка
    return err(new ServerErr());
  }

  /**
   * @inheritDoc
   */
  async logout(): Promise<Res<null, BackErr | HttpErr>> {
    const response = await request('/api/v1/auth/logout', { method: 'POST' });

    // Ошибка сети
    if (response.isErr()) {
      return err(new NetworkErr());
    }

    // Пользователь успешно вышел из системы
    if (response.unwrap().isOk) {
      return ok(null);
    }

    // Неизвестная ошибка
    return err(new ServerErr());
  }
}

/**
 * Регистрация в DI
 */
export const USER_HTTP_CLIENT = diContainer.register<UserHttpClient>(UserHttpClientImpl.name, new UserHttpClientImpl());
