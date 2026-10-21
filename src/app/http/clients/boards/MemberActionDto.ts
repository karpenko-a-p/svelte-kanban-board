import { isRecord, isString, type Validate } from '#app/core/common';

/**
 * DTO данных для манипуляций с членством участников
 */
export class MemberActionDto implements Validate {
  /**
   * Создание DTO данных для манипуляций с членством участников
   * @param userId - идентфиикатор пользователя
   */
  constructor(readonly userId: string) {}

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<MemberActionDto> {
    if (isRecord(dto) && isString(dto.userId)) {
      return new MemberActionDto(dto.userId);
    }
  }

  /**
   * @inheritdoc
   */
  validate(): string[] {
    const errors = [];

    if (!this.userId) {
      errors.push('Не установлен идентификатор пользователя');
    }

    return errors;
  }
}
