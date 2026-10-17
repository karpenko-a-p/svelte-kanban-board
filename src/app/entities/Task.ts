import { isEnum, isRecord, isString, type ToPlain } from '#app/core/common';

/**
 * Статус задачи
 */
export enum TaskStatus {
  /**
   * В бэклоге
   */
  NotStarted = 'NotStarted',
  /**
   * В работе
   */
  InProgress = 'InProgress',
  /**
   * Завершена
   */
  Done = 'Done'
}

/**
 * Приоритет задачи
 */
export enum TaskPriority {
  /**
   * Низкий
   */
  Low = 'Low',
  /**
   * Средний
   */
  Medium = 'Medium',
  /**
   * Высокий
   */
  High = 'High'
}

/**
 * Таска (задача)
 */
export class Task implements ToPlain {
  /**
   * Создание таски
   * @param id - идентифкиатор
   * @param name - наименование таски
   * @param description - описание
   * @param status - статус
   * @param priority - приоритет
   */
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public status: TaskStatus,
    public priority: TaskPriority,
    public reporter: string,
    public assigned: string
  ) {}

  /**
   * Проверка, что сущность расширяет тип Task
   * @param entity - проверяемая сущность
   */
  static isExtends(entity: unknown): entity is MoreThan<Task> {
    return (
      entity instanceof Task ||
      (isRecord(entity) &&
        isString(entity.id) &&
        isString(entity.name) &&
        isString(entity.description) &&
        isEnum(TaskStatus, entity.status) &&
        isEnum(TaskPriority, entity.priority) &&
        isString(entity.reporter) &&
        isString(entity.assigned))
    );
  }

  /**
   * Создание сущности таски с проверкой
   * @param id - идентификатор
   * @param name - наименование доски
   * @param description - описание
   * @param status - статус
   * @param priority - приоритет
   * @param reporter - создатель задачи
   * @param assigned - назначенный для выполнения
   */
  static new(
    id: string,
    name: string,
    description: string,
    status: TaskStatus,
    priority: TaskPriority,
    reporter: string,
    assigned: string
  ): Maybe<Task> {
    if (
      isString(id) &&
      isString(name) &&
      isString(description) &&
      isEnum(TaskStatus, status) &&
      isEnum(TaskPriority, priority) &&
      isString(reporter) &&
      isString(assigned)
    ) {
      return new Task(id, name, description, status, priority, reporter, assigned);
    }
  }

  /**
   * Создание таски на основе другого таски
   * @param sprint - модель таски
   */
  static from(task: Task): Maybe<Task> {
    if (task instanceof Task) {
      return new Task(task.id, task.name, task.description, task.status, task.priority, task.reporter, task.assigned);
    }
  }

  /**
   * Парсинг сущности к модели таски
   * @param entity - приводимая таски
   */
  static tryParse(entity: unknown): Maybe<Task> {
    if (Task.isExtends(entity)) {
      return new Task(entity.id, entity.name, entity.description, entity.status, entity.priority, entity.reporter, entity.assigned);
    }
  }

  /**
   * @inheritdoc
   */
  toPlain(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      priority: this.priority
    };
  }
}
