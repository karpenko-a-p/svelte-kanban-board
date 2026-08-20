import { isRecord, isString, type ToPojo } from '@app/core/common';

/**
 * DTO стандартной ошибки
 */
export class ErrorDto implements ToPojo {
  /**
   * Создание стандартного DTO ошибки
   * @param code - код ошибки
   * @param message - сообщение ошибки
   */
  protected constructor(
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
   * Создание DTO стандартной ошибки с проверкой
   * @param code - код ошибки
   * @param message - сообщение ошибки
   */
  static new(code: string, message: string): Maybe<ErrorDto> {
    if (isString(code) && isString(message)) {
      return new ErrorDto(code, message);
    }
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

  /**
   * @inheritDoc
   */
  toPojo(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message
    };
  }
}
