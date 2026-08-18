/**
 * Токен для хранения данных
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Token<T> {
  /**
   * Создание токена
   * @param id - идентификатор для проверки
   */
  constructor(readonly id: string) {}
}

/**
 * Контейнер-хранилище
 */
const container = new Map<Token<unknown>, unknown>();

/**
 * Получение из контейнера по токену
 * @param token - токен записи
 */
function get<T>(token: Token<T>): T {
  if (!container.has(token)) {
    throw new Error(`Не удалось получить значение по токену: ${token.id}`);
  }

  return container.get(token) as T;
}

/**
 * Установка в контейнер
 * @param token - токен записи
 * @param value - хранимое значение
 */
function set<T>(token: Token<T>, value: T): void {
  container.set(token, value);
}

/**
 * Создание токена
 */
function token<T>(tokenId: string): Token<T> {
  return new Token<T>(tokenId);
}

/**
 * DI-Контейнер для хранения и подстановки сущностей
 */
export const diContainer = { get, set, token };
