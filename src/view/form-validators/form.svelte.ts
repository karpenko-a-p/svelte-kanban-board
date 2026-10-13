import type { FormValidator } from './shared';
import type { EventHandler } from 'svelte/elements';

/**
 * Конфигурация формы
 */
type Options<T extends string> = {
  fields: Record<T, FormValidator>;
  onsubmit: EventHandler<SubmitEvent, HTMLFormElement>;
  onreject?(): unknown;
};

/**
 * Событие сабмита формы
 */
type SubmitFnEvent = SubmitEvent & {
  currentTarget: EventTarget & HTMLFormElement;
};

/**
 * Валидатор для формы
 */
class Form<T extends string> {
  readonly fields: Readonly<Record<T, FormValidator>>;
  readonly onsubmit: EventHandler<SubmitEvent, HTMLFormElement>;
  readonly invalid: boolean;
  submitted: boolean;
  reset: () => void;

  constructor(options: Options<T>) {
    this.fields = options.fields;

    this.invalid = $derived(Object.keys(this.fields).some((field) => this.fields[field as T].invalid));

    this.submitted = $state(false);

    // Обертка над событием отправки формы
    this.onsubmit = (event: SubmitFnEvent): void => {
      this.submitted = true;
      if (!this.invalid) options.onsubmit(event);
      else options.onreject?.();
    };

    // Сброс состояния формы
    this.reset = (): void => {
      this.submitted = false;
      for (const field in this.fields) {
        this.fields[field].reset();
      }
    };
  }
}

/**
 * Создание валидатора формы
 * @param options - конфигурация формы
 * @returns валдиатор
 */
export function form<T extends string>(options: Options<T>): Form<T> {
  return new Form(options);
}

/**
 * Псевдоним для удобства
 */
export const createForm = form;
