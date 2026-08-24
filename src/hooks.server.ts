import { logger } from '@app/core/server';
import { ServerErrorDto } from '@app/http/common-dtos';
import { AUTH_COOKIE_NAME } from '@app/http/constants';
import { TOKEN_SERVICE } from '@app/services/server';
import type { Handle, HandleServerError, ServerInit } from '@sveltejs/kit';

const tokenService = TOKEN_SERVICE.get();

/**
 * Запуск приложения
 */
export const init: ServerInit = () => {
  logger.info('Приложение запущено');
};

/**
 * Выполнение действия перед каждым запросом
 * @description Считываем данные пользователя из JWT токена если установлен
 */
export const handle: Handle = async ({ event, resolve }) => {
  const jwtToken = event.cookies.get(AUTH_COOKIE_NAME);

  // Проверка JWT токена и получение данных пользователя
  if (jwtToken) {
    event.locals.userId = await tokenService.verify(jwtToken);
    event.locals.isAuth = event.locals.userId !== null;
  }

  return resolve(event);
}

/**
 * Обработка серверной ошибки
 * @description Логирование ошибки и возврат пользователю DTO ошибки сервера
 */
export const handleError: HandleServerError = ({ error, event }) => {
  logger.error(`
    Непредвиденная ошибка сервера
    #1 Сообщение: ${error}
    #2 Метод: ${event.request.method}
    #3 URL: ${event.request.url}
    #4 Адресс: ${event.getClientAddress()}
    #5 Куки ${JSON.stringify(event.cookies.getAll())}
    #6 Хедеры ${JSON.stringify(event.request.headers.entries())}`);

  return new ServerErrorDto();
};
