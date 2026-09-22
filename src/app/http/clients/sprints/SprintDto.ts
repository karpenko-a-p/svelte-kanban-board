import { isRecord, isString, panic } from '@app/core/common';
import { Sprint } from '@app/entities';

/**
 * DTO спринта
 */
export class SprintDto {
  /**
   * Создание DTO спринта
   * @param id - индентификатор
   * @param name - название спринта
   * @param startedAt - время начала спринта
   * @param finishedAt - время окончания спринта
   */
  constructor(
    readonly id: string,
    readonly name: string,
    readonly startedAt: string,
    readonly finishedAt: string
  ) {}

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   * @returns DTO если получилось привести, ничего если нет
   */
  static tryParse(dto: unknown): Maybe<SprintDto> {
    if (
      isRecord(dto) &&
      isString(dto.id) &&
      isString(dto.name) &&
      isString(dto.startedAt) &&
      isString(dto.finishedAt)
    ) {
      return new SprintDto(dto.id, dto.name, dto.startedAt, dto.finishedAt);
    }
  }

  /**
   * Парсинг сущности спринта к DTO спринта
   * @param sprint - модель спринта
   */
  static fromSprint(sprint: Sprint): SprintDto {
    return new SprintDto(sprint.id, sprint.name, sprint.startedAt, sprint.finishedAt);
  }

  /**
   * Приведение DTO к сущности спринта
   * @returns сущность спринта
   */
  toSprint(): Sprint {
    return (
      Sprint.new(this.id, this.name, this.startedAt, this.finishedAt) ||
      panic('Не удалось создать сущность спринта из DTO спринта')
    );
  }
}
