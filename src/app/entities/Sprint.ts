import { isRecord, isString, type ToPlain } from '#app/core/common';

/**
 * Спринт
 */
export class Sprint implements ToPlain {
  /**
   * Создание спринта
   * @param id - индентификатор
   * @param name - название спринта
   * @param startedAt - время начала спринта
   * @param finishedAt - время окончания спринта
   */
  constructor(
    public id: string,
    public name: string,
    public startedAt: string,
    public finishedAt: string
  ) {}

  /**
   * Проверка, что сущность расширяет тип Sprint
   * @param entity - проверяемая сущность
   */
  static isExtends(entity: unknown): entity is MoreThan<Sprint> {
    return (
      entity instanceof Sprint ||
      (isRecord(entity) &&
        isString(entity.id) &&
        isString(entity.name) &&
        isString(entity.startedAt) &&
        isString(entity.finishedAt))
    );
  }

  /**
   * Создание сущности спринта с проверкой
   * @param id - идентификатор
   * @param name - наименование доски
   * @param description - описание
   */
  static new(id: string, name: string, startedAt: string, finishedAt: string): Maybe<Sprint> {
    if (isString(id) && isString(name) && isString(startedAt) && isString(finishedAt)) {
      return new Sprint(id, name, startedAt, finishedAt);
    }
  }

  /**
   * Создание спринта на основе другого спринта
   * @param sprint - модель спринта
   */
  static from(sprint: Sprint): Maybe<Sprint> {
    if (sprint instanceof Sprint) {
      return new Sprint(sprint.id, sprint.name, sprint.startedAt, sprint.finishedAt);
    }
  }

  /**
   * Парсинг сущности к модели спринта
   * @param entity - приводимая сущность
   */
  static tryParse(entity: unknown): Maybe<Sprint> {
    if (Sprint.isExtends(entity)) {
      return new Sprint(entity.id, entity.name, entity.startedAt, entity.finishedAt);
    }
  }

  /**
   * @inheritdoc
   */
  toPlain(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt
    };
  }
}
