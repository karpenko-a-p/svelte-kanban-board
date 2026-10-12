import type { FormValidator } from './shared';

type Options<T extends string> = {
  fields: Record<T, FormValidator>;
  onsubmit(fields: Record<T, FormValidator>): unknown;
  onreject?(fields: Record<T, FormValidator>): unknown;
};

export class Form<T extends string> {
  readonly fields: Record<T, FormValidator>;
  readonly onsubmit: (fields: Record<T, FormValidator>) => void;
  readonly invalid: boolean;
  submitted: boolean;

  constructor(options: Options<T>) {
    this.fields = options.fields;

    this.invalid = $derived(Object.keys(options.fields).some((field) => options.fields[field as T].invalid));

    this.submitted = $state(false);

    this.onsubmit = (): void => {
      this.submitted = true;
      if (!this.invalid) options.onsubmit(this.fields);
      else options.onreject?.(this.fields);
    };
  }
}
