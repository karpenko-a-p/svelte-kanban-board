/**
 * Правило валидации
 */
export type Rule<Val> = [Val, string];

/**
 * Валидатор для поля формы
 */
export interface FormValidator {
  /**
   * Инициализационное значение валидатора
   */
  value: string;
  /**
   * Сообщение об ошибке
   */
  readonly error: string;
  /**
   * Индикация состояния наличия ошибки
   */
  readonly invalid: boolean;
  /**
   * Сброс значения
   */
  reset(): void;
}
