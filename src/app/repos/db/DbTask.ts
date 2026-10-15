import type { BigSerial } from './types';

/**
 * Приоритет задачи
 */
export const enum DbTaskPriority {
  // Низкий
  Low = 'Low',
  // Средний
  Medium = 'Medium',
  // Высокий
  High = 'High'
}

/**
 * Приоритет задачи
 */
export const enum DbTaskStatus {
  // Ожидает
  NotStarted = 'NotStarted',
  // В работе
  InProgress = 'InProgress',
  // Выполнено
  Done = 'Done'
}

/**
 * Сущность задачи в БД
 */
export interface DbTask {
  id: BigSerial;
  name: string;
  description: string;
  status: DbTaskStatus;
  priority: DbTaskPriority;
  sprint_id: BigSerial;
  reporter_id: BigSerial;
  assigned_id: BigSerial;
}
