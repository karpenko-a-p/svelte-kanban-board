import { err, ok, type Res, type TryParse, type Validate } from '@app/core/common';
import { InvalidEntityErrorDto, ValidationErrorDto } from '@app/http/common-dtos';

/**
 * Извлечение тела запроса
 * @param request - запрос
 * @param entity - извлекаемая сущность
 * @returns - Тело запроса, иначе сформированный ответ ошибки
 */
export async function extractBody<T extends Validate>(
  request: Request,
  entity: TryParse<T>
): Promise<Res<T, Response>> {
  const dto = entity.tryParse(await request.json());

  // Передан некорректный тип данных
  if (!dto) {
    return err(Response.json(new InvalidEntityErrorDto()));
  }

  const errors = dto.validate();

  // Невалидные данные
  if (errors.length) {
    return err(Response.json(new ValidationErrorDto('Ошибка валидации данных', errors)));
  }

  return ok(dto);
}
