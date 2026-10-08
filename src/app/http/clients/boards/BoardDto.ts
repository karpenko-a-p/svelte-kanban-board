import { isRecord, isString, panic } from '#app/core/common';
import { Board } from '#app/entities';

/**
 * DTO канбан доски
 */
export class BoardDto {
  /**
   * создание DTO канбан доски
   * @param id - идентификатор
   * @param name - название доски
   * @param description - описание доски
   */
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string
  ) {}

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   * @returns DTO если получилось привести, ничего если нет
   */
  static tryParse(dto: unknown): Maybe<BoardDto> {
    if (isRecord(dto) && isString(dto.id) && isString(dto.name) && isString(dto.description)) {
      return new BoardDto(dto.id, dto.name, dto.description);
    }
  }

  /**
   * Парсинг сущности доски к DTO доски
   * @param board - модель доски
   */
  static fromBoard(board: Board): BoardDto {
    return new BoardDto(board.id, board.name, board.description);
  }

  /**
   * Приведение DTO к сущности канбан доски
   * @returns сущность канбан доски
   */
  toBoard(): Board {
    return (
      Board.new(this.id, this.name, this.description) ||
      panic('Не удалось создать сущность канбан доски из DTO канбан доски')
    );
  }
}
