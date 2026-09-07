import { err, ok, type Res } from '@app/core/common';
import { UnauthorizedErrorDto } from '@app/http/common-dtos';
import { UNAUTHORIZED } from '@app/http/constants';

/**
 * Извлечение идентификатора пользователя из запроса
 * @param locals - обеккт с локальными данными запроса
 * @returns - идентфикатор авторизованного пользователя, иначе сформированный ответ ошибки
 */
export function extractUserId(locals: App.Locals): Res<string, Response> {
  if (!locals.userId) return err(Response.json(new UnauthorizedErrorDto(), { status: UNAUTHORIZED }));
  return ok(locals.userId);
}
