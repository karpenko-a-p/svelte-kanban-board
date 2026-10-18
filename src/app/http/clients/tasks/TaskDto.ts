import { isEnum, isRecord, isString, panic } from '#app/core/common';
import { Task, TaskPriority, TaskStatus } from '#app/entities';

/**
 * DTO данных задачи, получаемой из api
 */
export class TaskDto {
  /**
   * Создание DTO данных задачи
   * @param id - идентификатор задачи
   * @param name - название задачи
   * @param description - описание задачи
   * @param status - статус задачи
   * @param priority - приоритет задачи
   * @param reporter - ФИО автора задачи
   * @param assigned - ФИО исполнителя
   */
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly status: TaskStatus,
    readonly priority: TaskPriority,
    readonly reporter: string,
    readonly assigned: string
  ) {}

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<TaskDto> {
    if (
      isRecord(dto) &&
      isString(dto.id) &&
      isString(dto.name) &&
      isString(dto.description) &&
      isEnum(TaskStatus, dto.status) &&
      isEnum(TaskPriority, dto.priority) &&
      isString(dto.reporter) &&
      isString(dto.assigned)
    ) {
      return new TaskDto(
        dto.id,
        dto.name,
        dto.description,
        dto.status as TaskStatus,
        dto.priority as TaskPriority,
        dto.reporter,
        dto.assigned
      );
    }
  }

  /**
   * Парсинг сущности задачи к DTO задачи
   * @param sprint - модель задачи
   */
  static fromTask(task: Task): TaskDto {
    return new TaskDto(task.id, task.name, task.description, task.status, task.priority, task.reporter, task.assigned);
  }

  /**
   * Приведение DTO к сущности задачи
   * @returns сущность задачи
   */
  toTask(): Task {
    return (
      Task.new(this.id, this.name, this.description, this.status, this.priority, this.reporter, this.assigned) ||
      panic('Не удалось создать сущность спринта из DTO спринта')
    );
  }
}
