import { isEnum, isRecord, isString, type Validate } from '#app/core/common';
import { TaskPriority } from '#app/entities';

/**
 * DTO данных для создания новой задачи
 */
export class CreateTaskDto implements Validate {
  /**
   * Создание DTO данных для создания новой задачи
   * @param name - название задачи
   * @param description - описание задачи
   * @param priority - приоритет задачи
   * @param sprintId - идентификатор спринта
   * @param reporterId - идентификатор автора задачи
   * @param assignedId - идентификатор исполнителя
   */
  constructor(
    readonly name: string,
    readonly description: string,
    readonly priority: TaskPriority,
    readonly sprintId: string,
    readonly reporterId: string,
    readonly assignedId: string
  ) {}

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<CreateTaskDto> {
    if (
      isRecord(dto) &&
      isString(dto.name) &&
      isString(dto.description) &&
      isString(dto.priority) &&
      isEnum(TaskPriority, dto.priority) &&
      isString(dto.sprintId) &&
      isString(dto.reporterId) &&
      isString(dto.assignedId)
    ) {
      return new CreateTaskDto(
        dto.name,
        dto.description,
        dto.priority as TaskPriority,
        dto.sprintId,
        dto.reporterId,
        dto.assignedId
      );
    }
  }

  /**
   * @inheritdoc
   */
  validate(): string[] {
    const errors = [];

    if (!this.name.length) {
      errors.push('Не передано название задачи');
    } else if (this.name.length > 64) {
      errors.push('Название должно быть до 64 символов включительно');
    }

    if (!isEnum(TaskPriority, this.priority)) {
      errors.push('Некорректный приоритет задачи');
    }

    if (!this.sprintId) {
      errors.push('Не передан идентификатор спринта');
    }

    return errors;
  }
}
