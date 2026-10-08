import type { User } from '#app/entities';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}

    interface Locals {
      /**
       * Идентификатор пользователя из JWT токена
       */
      userId?: Maybe<string>;
      /**
       * Пользователь авторизован
       */
      isAuth: boolean;
    }

    interface PageData {
      /**
       * Данные авторизованного пользователя
       */
      user?: Maybe<User>;
    }

    // interface PageState {}

    // interface Platform {}
  }

  declare type Maybe<T> = T | null | undefined;

  declare type MoreThan<T> = T & Record<string, unknown>;

  declare type NotNil<T> = T extends null | undefined ? never : T;
}

export {};
