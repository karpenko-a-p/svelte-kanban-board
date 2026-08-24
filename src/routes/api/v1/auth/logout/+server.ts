import { AUTH_COOKIE_NAME, OK } from '@app/http/constants';
import { json, type RequestHandler } from '@sveltejs/kit';

/**
 * Выход из системы
 * @description удаление JWT токена из авторизационной куки
 */
export const POST: RequestHandler = ({ cookies }) => {
  cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
  return json(null, { status: OK });
};
