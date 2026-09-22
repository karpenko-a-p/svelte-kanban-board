import { isRecord, isString, type Validate } from '@app/core/common';

/**
 * DTO данных для создания нового спринта
 */
export class CreateSprintDto implements Validate {
  /**
   * Создание DTO данных для создания нового спринта
   * @param name - название спринта
   * @param startedAt - время начала спринта
   * @param finishedAt - время окончания спринта
   * @param boardId - доска куда будет привязан спринта
   */
  constructor(
    readonly name: string,
    readonly startedAt: string,
    readonly finishedAt: string,
    readonly boardId: string
  ) {}

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<CreateSprintDto> {
    if (
      isRecord(dto) &&
      isString(dto.name) &&
      isString(dto.startedAt) &&
      isString(dto.finishedAt) &&
      isString(dto.boardId)
    ) {
      return new CreateSprintDto(dto.name, dto.startedAt, dto.finishedAt, dto.boardId);
    }
  }

  /**
   * @inheritdoc
   */
  validate(): string[] {
    const errors = [];

    if ( this.name.length <= 64) {
      errors.push('Название должно быть до 64 символов включительно');
    }

    return errors;
  }
}
