// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      /**
       * Идентификатор пользователя из JWT токена
       */
      userId: Maybe<string>;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  declare type Maybe<T> = T | null | undefined;

  declare type MoreThan<T> = T & Record<string, unknown>;
}

export {};
