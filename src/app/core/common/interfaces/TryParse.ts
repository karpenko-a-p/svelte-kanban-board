/**
 * Сущность можно спарсить
 */
export interface TryParse<T> {
  /**
   * Парсинг сущности
   * @param entity - приводимая сущность
   */
  tryParse(entity: unknown): Maybe<T>;
}
