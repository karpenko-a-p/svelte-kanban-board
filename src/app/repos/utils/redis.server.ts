import { err, ok, type Res } from '@app/core/common';
import { REDIS_URL } from '@app/core/server/env.server';
import { RedisClient } from 'bun';

/**
 * Экземпляр Redis
 */
const redis = new RedisClient(REDIS_URL, {
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
export function redisSet(key: string, ttl: number, val: unknown): void {
  void redis.setex(key, ttl, JSON.stringify(val));
}

/**
 * Функция для формирования набора действий
 */
type PipelineCb<T> = (redis: RedisClient) => T;

/**
 * Групповое выполнение действий в redis
 * @param cb - функция для формирования набора действий
 * @returns набор результатов или ошибка
 *
 * @example
 * const execRes = await redisPipeline(redis => {
 *   return Promise.all([
 *     redis.setex('user:1', 10, JSON.stringify({ id: 1 })),
 *     redis.get('user:2').then(res => JSON.parse(res))
 *   ]);
 * });
 *
 * if (execRes.isOk())
 *   const [setResponse, getResponse] = execRes.unwrap();
 */
export async function redisPipeline<T extends Promise<unknown>>(cb: PipelineCb<T>): Promise<Res<Awaited<T>, unknown>> {
  try {
    return ok(await cb(redis));
  } catch (error: unknown) {
    return err(error) as Res<Awaited<T>, unknown>;
  }
}

/**
 * Минута ttl для redis
 */
export const REDIS_MINUTE = 60;

/**
 * Час ttl для redis
 */
export const REDIS_HOUR = REDIS_MINUTE * 60;
