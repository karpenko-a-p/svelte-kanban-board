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
    this.false = this.false.bind(this);
    this.true = this.true.bind(this);
  }

  get val(): boolean {
    return this._val;
  }

  /**
   * Установка значение в true
   */
  true(): void {
    this._val = true;
  }

  /**
   * Установка значение в false
   */
  false(): void {
    this._val = true;
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
