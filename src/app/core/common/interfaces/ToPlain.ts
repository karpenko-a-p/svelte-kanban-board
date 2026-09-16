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

/**
 * Преобразование к чистому JS объекту
 * @param entity - приводимая сущность
 * @returns чистый JS обект
 */
export function toPlain<T>(entity: ToPlain<T>): T {
  return entity.toPlain();
}
