import { PROD } from '@app/core/server';
import { LoginUserDto, UserDto } from '@app/http/clients/user';
import { ErrorDto, ServerErrorDto } from '@app/http/common-dtos';
import {
  AUTH_COOKIE_LIFETIME,
  AUTH_COOKIE_NAME,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  OK,
  USER_NOT_EXISTS_ERR
} from '@app/http/constants';
import { extractBody } from '@app/http/extractors';
import { USER_REPO } from '@app/repos';
import { PASSWORD_SERVICE, TOKEN_SERVICE } from '@app/services/server';
import { json, type RequestHandler } from '@sveltejs/kit';

const userRepo = USER_REPO.get();
const tokenService = TOKEN_SERVICE.get();
const passwordService = PASSWORD_SERVICE.get();

/**
 * Авторизация пользователя
 * @description
 * 1. Проверка наличия данных пользователя в БД
 * 2. Проверка пароля пользователя
 * 3. Генерация и установка JWT токена
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
  const dto = await extractBody(request, LoginUserDto);

  // Невалидный контракт
  if (dto.isErr()) {
    return dto.unwrapErr();
  }

  const { login, password } = dto.unwrap();

  const [user, hashedPass] = await Promise.all([
    userRepo.getUserByLogin(login),
    userRepo.getUserPasswordByLogin(login)
  ]);

  // Пользователь не найден или пароли не сходятся
  if (!user || !hashedPass || !(await passwordService.verifyPassword(password, hashedPass))) {
    return json(new ErrorDto(USER_NOT_EXISTS_ERR, 'Неверные логин или пароль'), { status: BAD_REQUEST });
  }

  const jwtToken = await tokenService.sign(user.id);

  // Внутренняя ошибка при создании токена
  if (!jwtToken) {
    return json(new ServerErrorDto('Не удалось создать токен'), { status: INTERNAL_SERVER_ERROR });
  }

  // Установка JWT токена в куки
  cookies.set(AUTH_COOKIE_NAME, jwtToken, {
    path: '/',
    secure: PROD,
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + AUTH_COOKIE_LIFETIME)
  });

  return json(UserDto.fromUser(user), { status: OK });
};
