import type { FormValidator, Rule } from '#view/form-validators/shared';

/**
 * Параметры конфигурации валидатора для текстового поля
 */
type Options = {
  required?: Rule<boolean>;
  minLength?: Rule<number>;
  maxLength?: Rule<number>;
  matches?: Rule<RegExp>;
};

/**
 * Валидатор для текстового поля
 * @implements {FormValidator}
 */
class InputValidator implements FormValidator {
  value: string;
  readonly error: string;
  readonly invalid: boolean;
  reset: () => void;

  constructor(value = '', options: Options) {
    this.value = $state(value);

    this.error = $derived.by(() => {
      if (options.required?.[0] && !this.value.length) {
        return options.required[1];
      }

      if (options.minLength && this.value.length < options.minLength[0]) {
        return options.minLength[1];
      }

      if (options.maxLength && this.value.length > options.maxLength[0]) {
        return options.maxLength[1];
      }

      if (options.matches && !options.matches[0].test(this.value)) {
        return options.matches[1];
      }

      return '';
    });

    this.invalid = $derived(!!this.error);

    this.reset = (): void => void (this.value = value);
  }
}

/**
 * Создание валидатора для текстового поля
 * @param init - значение
 * @param options - набор валидаций
 */
export function input(init: string, options: Options): InputValidator {
  return new InputValidator(init, options);
}
