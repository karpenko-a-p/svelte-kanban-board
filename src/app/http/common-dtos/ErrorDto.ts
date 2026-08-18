import { isRecord, isString } from '@app/core/common';

/**
 * DTO стандартной ошибки
 */
export class ErrorDto {
  /**
   * Создание стандартного DTO ошибки
   * @param code - код ошибки
   * @param message - сообщение ошибки
   */
  constructor(
    readonly code: string,
    readonly message: string
  ) {}

  /**
   * Проверка, что сущность расширяет тип ErrorDto
   * @param dto - проверяемая сущность
   */
  static isExtends(dto: unknown): dto is MoreThan<ErrorDto> {
    return isRecord(dto) && isString(dto.code) && isString(dto.message);
  }

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<ErrorDto> {
    if (ErrorDto.isExtends(dto)) {
      return new ErrorDto(dto.code, dto.message);
    }
  }
}
