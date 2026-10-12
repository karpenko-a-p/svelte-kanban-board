/**
 * Правило валидации
 */
export type Rule<Val> = [Val, string];

/**
 * Валидатор для поля формы
 */
export interface FormValidator {
  value: string;
  readonly error: string;
  readonly invalid: boolean;
}
