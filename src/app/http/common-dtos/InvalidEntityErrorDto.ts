import { INVALID_ENTITY_ERR } from '@app/http/constants';

import { ErrorDto } from './ErrorDto.ts';

/**
 * DTO ошибки для некорректной сущности
 */
export class InvalidEntityErrorDto extends ErrorDto {
  /**
   * Создание DTO
   * @param message - сообщение об ошибке
   */
  constructor(message = 'Передан некорректный тип данных') {
    super(INVALID_ENTITY_ERR, message);
  }

  /**
   * Проверка, что сущность расширяет тип InvalidEntityErrorDto
   * @param dto - проверяемая сущность
   */
  static isExtends(dto: unknown): dto is MoreThan<InvalidEntityErrorDto> {
    return ErrorDto.isExtends(dto) && dto.code === INVALID_ENTITY_ERR;
  }

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<InvalidEntityErrorDto> {
    if (ErrorDto.isExtends(dto) && dto.code === INVALID_ENTITY_ERR) {
      return new InvalidEntityErrorDto(dto.message);
    }
  }
}
