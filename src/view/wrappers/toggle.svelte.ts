/**
 * Обертка-переключатель для булева выражения
 */
class Toggle {
  /**
   * Значение переключателя
   */
  private _val: boolean;

  /**
   * Создание обертки
   * @param init - первоначальное значение
   */
  constructor(init: boolean) {
    this._val = $state(init);
    this.toggle = this.toggle.bind(this);
    this.falsy = this.falsy.bind(this);
    this.truthy = this.truthy.bind(this);
  }

  get val(): boolean {
    return this._val;
  }

  /**
   * Установка значение в true
   */
  truthy(): void {
    this._val = true;
  }

  /**
   * Установка значение в false
   */
  falsy(): void {
    this._val = false;
  }

  /**
   * Переключение значения
   */
  toggle(): void {
    this._val = !this._val;
  }
}

/**
 * Создание обертки
 * @param init - инициализационное значение
 */
export function toggle(init: boolean): Toggle {
  return new Toggle(init);
}
