/**
 * Режим разработки
 */
export const DEV = import.meta.env.DEV;

/**
 * Релизная сборка
 */
export const PROD = import.meta.env.PROD;

/**
 * Секретный ключ для генерации токена
 */
export const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Бэк url
 */
export const DATABASE_URL = process.env.DATABASE_URL;

/**
 * URL Редис
 */
export const REDIS_URL = process.env.REDIS_URL;
