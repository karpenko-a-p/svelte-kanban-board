import { diContainer } from '@app/core/common';
import { DEV } from '@app/core/server';
import { RegisterUserDto, UserDto } from '@app/http/clients/user';
import { ErrorDto, InvalidEntityErrorDto, ServerErrorDto, ValidationErrorDto } from '@app/http/common-dtos';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, LOGIN_EXISTS, UNPROCESSABLE_ENTITY } from '@app/http/constants';
import { parseJson } from '@app/http/utils';
import { USER_REPO } from '@app/repos';
import { PASSWORD_SERVICE, TOKEN_SERVICE } from '@app/services/server';
import { json, type RequestHandler } from '@sveltejs/kit';

const userRepo = diContainer.get(USER_REPO);
const tokenService = diContainer.get(TOKEN_SERVICE);
const passwordService = diContainer.get(PASSWORD_SERVICE);

/**
 * Регистрация пользователя
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const dto = RegisterUserDto.tryParse(await parseJson(request));

    // Передан некорректный тип данных
    if (!dto) {
      return json(new InvalidEntityErrorDto(), { status: UNPROCESSABLE_ENTITY });
    }

    const errors = dto.validate();

    // Невалидные данные
    if (errors.length) {
      return json(new ValidationErrorDto('', errors), { status: BAD_REQUEST });
    }

    const exists = await userRepo.checkUserExistsByLogin(dto.login);

    // Пользователь уже существует
    if (exists) {
      return json(ErrorDto.new(LOGIN_EXISTS, `Пользователь с логином "${dto.login}" уже существует`), {
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
    cookies.set('JWT', jwtToken, {
      path: '/',
      secure: !DEV,
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
    });

    return json(UserDto.fromUser(user), { status: CREATED });
  } catch (error: unknown) {
    console.error(error);
    return json(new ServerErrorDto(), { status: INTERNAL_SERVER_ERROR });
  }
};
