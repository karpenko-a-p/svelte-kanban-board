/**
 * Реализация Result паттерна
 */
export interface Res<T, K> {
  /**
   * Результат успешный
   */
  isOk(): boolean;

  /**
   * Ошибка, нет результата
   */
  isErr(): boolean;

  /**
   * Получение ОК результата
   */
  unwrap(): T;

  /**
   * Получение ОК результата или дефолтного значения
   * @param val - дефолтное значение
   */
  unwrapOr(val: T): T;

  /**
   * Получение ошибки ERR результата
   */
  unwrapErr(): K;

  /**
   * Проверка ошибки
   * @param err - сверяемая ошибка
   */
  matchErr(err: K): boolean;

  /**
   * Приведение OK результата к новому значению или формату
   * @param mapper - функция приведения результата
   */
  map<U>(mapper: (val: T) => U): Res<U, K>;

  /**
   * Приведение ERR результата к новому значению или формату
   * @param mapper
   */
  mapErr<U>(mapper: (err: K) => U): Res<T, U>;
}

/**
 * OK результат
 */
export class Ok<T, K> implements Res<T, K> {
  /**
   * Хранение успешного результата
   * @param val - результат если Ok
   */
  constructor(private readonly val: T) {}

  /**
   * @inheritDoc
   */
  isErr(): boolean {
    return false;
  }

  /**
   * @inheritDoc
   */
  isOk(): boolean {
    return true;
  }

  /**
   * @inheritDoc
   */
  matchErr(): boolean {
    return false;
  }

  /**
   * @inheritDoc
   */
  unwrap(): T {
    return this.val;
  }

  /**
   * @inheritDoc
   */
  unwrapErr(): K {
    throw new Error('Нельзя получить значение ERR у OK результата');
  }

  /**
   * @inheritDoc
   */
  unwrapOr(): T {
    return this.val;
  }

  /**
   * @inheritDoc
   */
  map<U>(mapper: (val: T) => U): Res<U, K> {
    return new Ok(mapper(this.val));
  }

  /**
   * @inheritDoc
   */
  mapErr<U>(): Res<T, U> {
    return this as unknown as Res<T, U>;
  }
}

/**
 * ERR результат
 */
export class Err<T, K> implements Res<T, K> {
  /**
   * Хранение результата ошибки
   * @param err - результат если Err
   */
  constructor(private readonly err: K) {}

  /**
   * @inheritDoc
   */
  isErr(): boolean {
    return true;
  }

  /**
   * @inheritDoc
   */
  isOk(): boolean {
    return false;
  }

  /**
   * @inheritDoc
   */
  matchErr(err: K): boolean {
    return this.err === err;
  }

  /**
   * @inheritDoc
   */
  unwrap(): T {
    throw new Error('Нельзя получить значение OK у ERR результата');
  }

  /**
   * @inheritDoc
   */
  unwrapErr(): K {
    return this.err;
  }

  /**
   * @inheritDoc
   */
  unwrapOr(val: T): T {
    return val;
  }

  /**
   * @inheritDoc
   */
  map<U>(): Res<U, K> {
    return this as unknown as Res<U, K>;
  }

  /**
   * @inheritDoc
   */
  mapErr<U>(mapper: (err: K) => U): Res<T, U> {
    return new Err(mapper(this.err));
  }
}

/**
 * Создание OK результата
 * @param val - значение результата
 */
export function ok<T, K>(val: T): Res<T, K> {
  return new Ok(val);
}

/**
 * Создание ERR результата
 * @param err - значение ошибки
 */
export function err<T, K>(err: K): Res<T, K> {
  return new Err(err);
}
