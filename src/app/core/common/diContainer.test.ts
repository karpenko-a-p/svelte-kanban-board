import { describe, expect, test } from 'vitest';
import { diContainer, Token } from '@app/core/common/diContainer';

describe('diContainer', () => {
  test('Создание токена', () => {
    const tokenId = 'token_id';
    const token = diContainer.token(tokenId);

    expect(token).toBeInstanceOf(Token);
    expect(token.id).toBe(tokenId);
  });

  test('Установка и получение из контейнера', () => {
    const someValue = { some: 'object' };
    const token = diContainer.token<object>('');
    diContainer.set(token, someValue);
    const valueFromContainer = diContainer.get(token);

    expect(valueFromContainer).toBe(someValue);
    expect(valueFromContainer).toEqual(someValue);
  });

  test('Попытка получения неустановленного в контейнере элемента', () => {
    const token = diContainer.token<object>('');

    expect(() => diContainer.get(token)).toThrow();
  });

  test('Переустановка элемента в контейнере', () => {
    const token = diContainer.token<object>('');

    // Первая установка
    const someValue = { some: 'object' };
    diContainer.set(token, someValue);
    const valueFromContainer = diContainer.get(token);

    expect(valueFromContainer).toBe(someValue);
    expect(valueFromContainer).toEqual(someValue);

    // Вторая установка
    const someAnotherValue = { some: 'object' };
    diContainer.set(token, someAnotherValue);
    const anotherValueFromContainer = diContainer.get(token);

    expect(anotherValueFromContainer).toBe(someAnotherValue);
    expect(anotherValueFromContainer).toEqual(someAnotherValue);
  });
});
