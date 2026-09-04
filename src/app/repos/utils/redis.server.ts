import { REDIS_URL } from '@app/core/server/env.server';
import { RedisClient } from 'bun';

/**
 * Экземпляр Redis
 */
export const redis = new RedisClient(REDIS_URL, {
  autoReconnect: true, // Автоматическое переподключение
  connectionTimeout: 5_000, // Ожидание до подключения 5 сек
  enableAutoPipelining: true, // Подключение группировки запросов
  maxRetries: 2 ** 32 - 1, // Бесконечное кол-во попыток переподключения
  idleTimeout: 0, // Отключение разрыва неактивного соединения
  enableOfflineQueue: false // Отключение очереди запросов если нет соединения
});

/**
 * Получение данных из redis
 * @param key - ключ для получения данных
 * @returns undefined если ключ не установлен, иначе значение
 */
export async function redisGet<T>(key: string): Promise<Maybe<T>> {
  try {
    const res = await redis.get(key);

    if (res !== null) {
      return JSON.parse(res);
    }
  } catch (err: unknown) {
    // Невалидное содержимое ключа
    if (err instanceof SyntaxError) {
      void redis.del(key);
    }
  }
}

/**
 * Установка данных в redis
 * @param key - ключ для сохранения данных
 * @param ttl - время жизни данных в секундах
 * @param val - сохраняемое значение
 */
export function redisSet(key: string, ttl: number, val: unknown): Promise<'OK'> {
  return redis.setex(key, ttl, JSON.stringify(val ?? null));
}

/**
 * Минута ttl для redis
 */
export const REDIS_MINUTE = 60;

/**
 * Час ttl для redis
 */
export const REDIS_HOUR = REDIS_MINUTE * 60;
