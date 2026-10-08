import { PROD } from '#app/core/server';
import { RegisterUserDto, UserDto } from '#app/http/clients/user';
import { ErrorDto, ServerErrorDto } from '#app/http/common-dtos';
import {
  AUTH_COOKIE_LIFETIME,
  AUTH_COOKIE_NAME,
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  USER_EXISTS_ERR
} from '#app/http/constants';
import { extractBody } from '#app/http/extractors';
import { USER_REPO } from '#app/repos';
import { PASSWORD_SERVICE, TOKEN_SERVICE } from '#app/services/server';
import type { RequestHandler } from '@sveltejs/kit';

const userRepo = USER_REPO.get();
const tokenService = TOKEN_SERVICE.get();
const passwordService = PASSWORD_SERVICE.get();

/**
 * Регистрация пользователя
 * @description
 * 1. Проверка уникальности данных пользователя
 * 2. Создание записи пользователя в БД
 * 3. Генерация и установка JWT токена
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
  const dto = await extractBody(request, RegisterUserDto);

  // Невалидный контракт
  if (dto.isErr()) {
    return dto.unwrapErr();
  }

  const { fio, login, password } = dto.unwrap();

  const exists = await userRepo.checkUserExistsByLogin(login);

  // Пользователь уже существует
  if (exists) {
    return Response.json(new ErrorDto(USER_EXISTS_ERR, `Пользователь с логином "${login}" уже существует`), {
      status: BAD_REQUEST
    });
  }

  const hashedPass = await passwordService.hashPassword(password);

  const user = await userRepo.createUser(login, fio, hashedPass);

  // Внутренняя ошибка при создании записи пользователя
  if (user.isErr()) {
    return Response.json(new ServerErrorDto('Не удалось создать запись пользователя'), {
      status: INTERNAL_SERVER_ERROR
    });
  }

  const jwtToken = await tokenService.sign(user.unwrap().id);

  // Внутренняя ошибка при создании токена
  if (!jwtToken) {
    return Response.json(new ServerErrorDto('Не удалось создать токен'), { status: INTERNAL_SERVER_ERROR });
  }

  // Установка JWT токена в куки
  cookies.set(AUTH_COOKIE_NAME, jwtToken, {
    path: '/',
    secure: PROD,
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + AUTH_COOKIE_LIFETIME)
  });

  return Response.json(UserDto.fromUser(user.unwrap()), { status: CREATED });
};
