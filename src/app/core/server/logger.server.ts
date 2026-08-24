import { PROD } from '@app/core/server/env.server';
import pino from 'pino';

/**
 * Конфигурация логгера
 * @description запись логов в файл и трансляция в stdout
 */
const transport = PROD
  // ПРОМ конфигурация с логированием в файл и поток вывода
  ? pino.transport({
      targets: [
        // Запись в stdout
        {
          target: 'pino/file',
          level: 'info',
          options: {
            destination: 1
          }
        },
        // Запись в файл
        {
          target: 'pino-roll',
          options: {
            file: './logs/app.log',
            frequency: 'daily', // Создавать новый файл каждый день
            size: '100m', // Или если файл превысит 100 Мегабайт
            mkdir: true,
            keep: { count: 7 } // Хранить логи только за последние 7 дней
          }
        }
      ]
    })
  // ДЕВ конфигурация с понятным выводом на консоль
  : pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard'
      }
    });

/**
 * Pino логгер
 */
export const logger = pino(transport);
