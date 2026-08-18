import { describe, expect, test } from 'vitest';
import { Err, err, Ok, ok } from '@app/core/common/patterns/Res';

describe('Result паттерн', () => {
  test('Создание OK результата ', () => {
    const res = ok<null, null>(null);
    expect(res).toBeInstanceOf(Ok);
  });

  test('Создание Err результата ', () => {
    const res = err<null, null>(null);
    expect(res).toBeInstanceOf(Err);
  });

  test('Методы у OK результата', () => {
    const someValue = { some: 'object' };
    const res = ok<object, null>(someValue);

    expect(res.isOk()).toBeTruthy();
    expect(res.isErr()).toBeFalsy();
    expect(res.unwrap()).toBe(someValue);
    expect(res.unwrap()).toEqual(someValue);
    expect(res.unwrapOr({})).toBe(someValue);
    expect(res.unwrapOr({})).toEqual(someValue);
    expect(() => res.unwrapErr()).toThrow();
    expect(res.matchErr(null)).toBeFalsy();
  });

  test('Методы у Err результата', () => {
    const someValue = { some: 'object' };
    const res = err<number, object>(someValue);

    expect(res.isOk()).toBeFalsy();
    expect(res.isErr()).toBeTruthy();
    expect(() => res.unwrap()).toThrow();
    expect(res.unwrapOr(0)).toBe(0);
    expect(res.unwrapErr()).toBe(someValue);
    expect(res.unwrapErr()).toEqual(someValue);
    expect(res.matchErr(someValue)).toBeTruthy();
  });

  test('Методы для маппинга результатов', () => {
    // Маппинг OK результата к другому OK результату
    expect(
      ok<number, string>(0)
        .map((val) => val + 10)
        .unwrap()
    ).toBe(10);

    // Маппинг ERR результата к другому ERR результату (Не дает эффекта на OK результате)
    expect(
      ok<number, string>(0)
        .mapErr((err) => `${err} new!`)
        .unwrap()
    ).toBe(0);

    // Маппинг ERR результата к OK результату (Не дает эффекта на ERR результате)
    expect(() =>
      err<number, string>('error')
        .map((val) => val + 10)
        .unwrap()
    ).toThrow();

    // Маппинг ERR результата к другому ERR результату
    expect(
      err<number, string>('error')
        .mapErr((err) => `${err} new!`)
        .unwrapErr()
    ).toBe('error new!');

    // Цепочка приведений OK результата
    expect(
      ok<number, string>(0)
        .map((val) => val + 10)
        .mapErr((err) => `${err} new!`)
        .map<string>((val) => String(val * 5))
        .unwrap()
    ).toBe('50');

    // Цепочка приведений ERR результата
    expect(
      err<number, string>('10')
        .mapErr((err) => `${err}0`)
        .map((val) => val + 10)
        .mapErr<number>((err) => Number(err) / 2)
        .unwrapErr()
    ).toBe(50);
  });
});
