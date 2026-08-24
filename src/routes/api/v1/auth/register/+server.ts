import { PROD } from '@app/core/server';
import { RegisterUserDto, UserDto } from '@app/http/clients/user';
import { ErrorDto, InvalidEntityErrorDto, ServerErrorDto, ValidationErrorDto } from '@app/http/common-dtos';
import {
  AUTH_COOKIE_LIFETIME,
  AUTH_COOKIE_NAME,
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  UNPROCESSABLE_ENTITY,
  USER_EXISTS
} from '@app/http/constants';
import { parseJson } from '@app/http/utils';
import { USER_REPO } from '@app/repos';
import { PASSWORD_SERVICE, TOKEN_SERVICE } from '@app/services/server';
import { json, type RequestHandler } from '@sveltejs/kit';

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
  const dto = RegisterUserDto.tryParse(await parseJson(request));

  // Передан некорректный тип данных
  if (!dto) {
    return json(new InvalidEntityErrorDto(), { status: UNPROCESSABLE_ENTITY });
  }

  const errors = dto.validate();

  // Невалидные данные
  if (errors.length) {
    return json(new ValidationErrorDto('Ошибка валидации данных', errors), { status: BAD_REQUEST });
  }

  const exists = await userRepo.checkUserExistsByLogin(dto.login);

  // Пользователь уже существует
  if (exists) {
    return json(ErrorDto.new(USER_EXISTS, `Пользователь с логином "${dto.login}" уже существует`), {
      status: BAD_REQUEST
    });
  }

  const hashedPass = await passwordService.hashPassword(dto.password);

  const user = await userRepo.createUser(dto.login, dto.fio, hashedPass);

  // Внутренняя ошибка при создании записи пользователя
  if (!user) {
    return json(new ServerErrorDto('Не удалось создать запись пользователя'), { status: INTERNAL_SERVER_ERROR });
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

  return json(UserDto.fromUser(user), { status: CREATED });
};
