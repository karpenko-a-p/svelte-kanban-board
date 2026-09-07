import { isRecord, isString, type Validate } from '@app/core/common';

/**
 * DTO данных для сощдания новой канбан доски
 */
export class CreateBoardDto implements Validate {
  /**
   * Создание DTO данныхх для создания доски
   * @param name - название новой доски
   * @param description - описание новой доски
   */
  constructor(
    readonly name: string,
    readonly description: string
  ) {}

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<CreateBoardDto> {
    if (isRecord(dto) && isString(dto.name) && isString(dto.description)) {
      return new CreateBoardDto(dto.name, dto.description);
    }
  }

  /**
   * @inheritdoc
   */
  validate(): string[] {
    const errors = [];

    if (this.name.length < 6 || this.name.length > 64) {
      errors.push('Название должно быть от 6 до 64 символов включительно');
    }

    return errors;
  }
}
