import { isArray, isString } from '#app/core/common';
import { VALIDATION_ERR } from '#app/http/constants';

import { ErrorDto } from './ErrorDto';

/**
 * DTO ошибки валидации
 */
export class ValidationErrorDto extends ErrorDto {
  /**
   * Создание DTO ошибки валидации
   * @param message - сообщение ошибки
   * @param issues - сообщения об ошибках валидации
   */
  constructor(
    message: string,
    readonly issues: string[]
  ) {
    super(VALIDATION_ERR, message);
  }

  /**
   * Проверка, что сущность расширяет тип ValidationErrorDto
   * @param dto - проверяемая сущность
   */
  static isExtends(dto: unknown): dto is MoreThan<ValidationErrorDto> {
    return ErrorDto.isExtends(dto) && dto.code === VALIDATION_ERR && isArray(dto.issues) && dto.issues.every(isString);
  }

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<ValidationErrorDto> {
    if (ValidationErrorDto.isExtends(dto)) {
      return new ValidationErrorDto(dto.message, dto.issues);
    }
  }
}
