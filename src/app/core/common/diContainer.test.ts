import { describe, expect, test } from 'vitest';
import { diContainer } from '#app/core/common/diContainer';

describe('diContainer', () => {
  test('Регистрация в контейнере', () => {
    const tokenId = 'token_id';
    const token = diContainer.register(tokenId, 'some value');

    expect(token.id).toBe(tokenId);
  });

  test('Получение из контейнера', () => {
    const someValue = { some: 'value' };
    const token = diContainer.register('', someValue);

    expect(token.get()).toBe(diContainer.get(token));
    expect(token.get()).toEqual(diContainer.get(token));
    expect(token.get()).toBe(someValue);
    expect(token.get()).toEqual(someValue);
  });

  test('Регистрация и повторная установка в контейнер', () => {
    //  Регистрация
    const someValue = { some: 'object' };
    const token = diContainer.register<object>('', someValue);

    const someAnotherValue = { someAnother: 'object' };
    diContainer.set(token, someAnotherValue);

    const valueFromContainer = diContainer.get(token);

    expect(valueFromContainer).toBe(someAnotherValue);
    expect(valueFromContainer).toEqual(someAnotherValue);
    expect(valueFromContainer).not.toBe(someValue);
    expect(valueFromContainer).not.toEqual(someValue);
  });

  test('Попытка получения неустановленного в контейнере элемента', () => {
    expect(() => diContainer.get('token' as never)).toThrow();
  });
});
