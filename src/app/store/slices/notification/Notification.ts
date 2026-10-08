import type { NotificationType } from './NotificationType';

/**
 * Хранимая сущность уведомления
 */

export type Notification = {
  /**
   * Идентификатор уведомления
   */
  id: string;
  /**
   * Тип уведомления
   */
  type: NotificationType;
  /**
   * Сообщение уведомления
   */
  message: string;
};
