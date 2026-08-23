/**
 * Токен для хранения данных
 */
class Token<T> {
  /**
   * Создание токена
   * @param id - идентификатор для проверки
   */
  constructor(readonly id: string) {}

  /**
   * Получение из контейнера
   * @returns данные хранящиеся в контейнере
   */
  get(): T {
    return get(this);
  }
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
 * Регистрация в контейнере
 * @param tokenId - идентификатор для токена
 * @param value - хранимое значение
 * @returns токен привязанный к сущности
 */
function register<T>(tokenId: string, value: T): Token<T> {
  const token = new Token<T>(tokenId);
  set(token, value);
  return token;
}

/**
 * DI-Контейнер для хранения и подстановки сущностей
 */
export const diContainer = { get, set, register };
