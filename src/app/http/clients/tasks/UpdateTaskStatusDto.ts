import { isEnum, isRecord, type Validate } from '#app/core/common';
import { TaskStatus } from '#app/entities';

/**
 * DTO данных для обновление статуса задачи
 */
export class UpdateTaskStatusDto implements Validate {
  /**
   * Создание DTO данных для обновление статуса задачи
   * @param status - статус задачи
   */
  constructor(readonly status: TaskStatus) {}

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<UpdateTaskStatusDto> {
    if (isRecord(dto) && isEnum(TaskStatus, dto.status)) {
      return new UpdateTaskStatusDto(dto.status);
    }
  }

  /**
   * @inheritdoc
   */
  validate(): string[] {
    const errors = [];

    if (!isEnum(TaskStatus, this.status)) {
      errors.push('Некорректный статус задачи');
    }

    return errors;
  }
}
