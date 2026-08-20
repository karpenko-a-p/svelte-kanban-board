import { INVALID_ENTITY } from '@app/http/constants';

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
    super(INVALID_ENTITY, message);
  }

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<InvalidEntityErrorDto> {
    if (ErrorDto.isExtends(dto) && dto.code === INVALID_ENTITY) {
      return new InvalidEntityErrorDto(dto.message);
    }
  }
}
