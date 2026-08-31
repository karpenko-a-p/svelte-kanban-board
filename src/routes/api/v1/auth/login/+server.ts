import { PROD } from '@app/core/server';
import { LoginUserDto, UserDto } from '@app/http/clients/user';
import { ErrorDto, InvalidEntityErrorDto, ServerErrorDto, ValidationErrorDto } from '@app/http/common-dtos';
import {
  AUTH_COOKIE_LIFETIME,
  AUTH_COOKIE_NAME,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
  USER_NOT_EXISTS
} from '@app/http/constants';
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
  const dto = LoginUserDto.tryParse(await request.json());

  // Передан некорректный тип данных
  if (!dto) {
    return json(new InvalidEntityErrorDto(), { status: UNPROCESSABLE_ENTITY });
  }

  const errors = dto.validate();

  // Невалидные данные
  if (errors.length) {
    return json(new ValidationErrorDto('Ошибка валидации данных', errors), { status: BAD_REQUEST });
  }

  const [user, hashedPass] = await Promise.all([
    userRepo.getUserByLogin(dto.login),
    userRepo.getUserPasswordByLogin(dto.login)
  ]);

  // Пользователь не найден или пароли не сходятся
  if (!user || !hashedPass || !(await passwordService.verifyPassword(dto.password, hashedPass))) {
    return json(ErrorDto.new(USER_NOT_EXISTS, 'Неверные логин или пароль'), { status: BAD_REQUEST });
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
