import { NOT_FOUND_ERR } from '#app/http/constants';

import { ErrorDto } from './ErrorDto.ts';

/**
 * DTO ошибки для не существующей сущности
 */
export class NotFoundErrorDto extends ErrorDto {
  /**
   * Создание DTO
   * @param message - сообщение об ошибке
   */
  constructor(message = 'Не найдено') {
    super(NOT_FOUND_ERR, message);
  }

  /**
   * Проверка, что сущность расширяет тип NotFoundErrorDto
   * @param dto - проверяемая сущность
   */
  static isExtends(dto: unknown): dto is MoreThan<NotFoundErrorDto> {
    return ErrorDto.isExtends(dto) && dto.code === NOT_FOUND_ERR;
  }

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<NotFoundErrorDto> {
    if (ErrorDto.isExtends(dto) && dto.code === NOT_FOUND_ERR) {
      return new NotFoundErrorDto(dto.message);
    }
  }
}
