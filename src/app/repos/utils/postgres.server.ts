import { DATABASE_URL } from '@app/core/server';
import { SQL } from 'bun';

/**
 * Адаптер для работы с postgres
 */
export const postgres = new SQL({
  url: DATABASE_URL, // URL для подключения
  max: 20, // Максимум подключений в пуле
  idleTimeout: 30, // Отключение неактивного соединения через 30 сек
  maxLifetime: 0, // Бесконечный срок жизни подключения
  connectionTimeout: 15 // Ожидание до подключения 15 сек
});
