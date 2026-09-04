/**
 * Сущность можно преобразовать к чистому JS объекту
 */
export interface ToPlain<T = Record<string, unknown>> {
  /**
   *  Преобразование к чистому JS объекту
   *  @returns чистый JS объект на основании экземпляра класса
   */
  toPlain(): T;
}
