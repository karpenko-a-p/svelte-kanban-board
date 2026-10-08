import { isRecord, isString, type ToPlain } from '#app/core/common';

/**
 * Канбан доска
 */
export class Board implements ToPlain {
  /**
   * Создание сущности доски
   * @param id - идентификатор
   * @param name - наименование доски
   * @param description - описание
   */
  private constructor(
    public id: string,
    public name: string,
    public description: string
  ) {}

  /**
   * Проверка, что сущность расширяет тип Board
   * @param entity - проверяемая сущность
   */
  static isExtends(entity: unknown): entity is MoreThan<Board> {
    return (
      entity instanceof Board ||
      (isRecord(entity) && isString(entity.id) && isString(entity.name) && isString(entity.description))
    );
  }

  /**
   * Создание сущности доски с проверкой
   * @param id - идентификатор
   * @param name - наименование доски
   * @param description - описание
   */
  static new(id: string, name: string, description: string): Maybe<Board> {
    if (isString(id) && isString(name) && isString(description)) {
      return new Board(id, name, description);
    }
  }

  /**
   * Создание доски на основе другого доски
   * @param board - модель доски
   */
  static from(board: Board): Maybe<Board> {
    if (board instanceof Board) {
      return new Board(board.id, board.name, board.description);
    }
  }

  /**
   * Парсинг сущности к модели доски
   * @param entity - приводимая сущность
   */
  static tryParse(entity: unknown): Maybe<Board> {
    if (Board.isExtends(entity)) {
      return new Board(entity.id, entity.name, entity.description);
    }
  }

  /**
   * @inheritdoc
   */
  toPlain(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      description: this.description
    };
  }
}
