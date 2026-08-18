/**
 * Методы билдера для сборки сущности
 */
export type Builder<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (val: T[K]) => Builder<T>;
};

/**
 * Абстрактный билдер
 */
export abstract class AbstractBuilder<T> {
  /**
   * Инициализация абстрактного билдера
   * @param entity - сущность для сборки
   */
  protected constructor(protected entity: T) {}

  /**
   * Получение собранной сущности
   * @returns собранная сущность
   */
  build(): T {
    return this.entity;
  }
}
