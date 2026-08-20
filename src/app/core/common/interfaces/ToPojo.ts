/**
 * Сущность можно преобразовать к чистому JS объекту (Plain Old Java (Script) Object)
 */
export interface ToPojo {
  /**
   *  Преобразование к POJO
   *  @returns чистый JS объект на основании экземпляра класса
   */
  toPojo(): Record<string, unknown>
}