/**
 * Простейший стор для хранения одной структуры
 */
export class Store<T> {
  /**
   * Хранимая структура
   */
  private value: T;

  constructor(init: T) {
    this.value = $state(init);
  }

  /**
   * Получения значения
   */
  get(): T {
    return this.value;
  }

  /**
   * Установка значения
   * @param val - новое значение
   */
  set(val: T): void {
    this.value = val;
  }
}
