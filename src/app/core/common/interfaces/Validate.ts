/**
 * Самопроверка сущности на наличие ошибок
 */
export interface Validate {
  /**
   * Самопроверка сущности
   * @returns массив ошибок
   */
  validate(): string[]
}