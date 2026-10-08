import { diContainer } from '#app/core/common';
import type { Notification } from './Notification';
import type { NotificationType } from './NotificationType';

/**
 * Хранилище для клиентских уведомлений
 */
export interface NotificationStore {
  /**
   * Получение состояния открытия панели с уведомлениями
   * @returns true если панель открыта, иначе false
   */
  notificationsVisible(): boolean;

  /**
   * Закрытие панели с уведомлениями
   */
  closeNotiffications(): void;

  /**
   * Открытие панели с уведомлениями
   */
  openNotiffications(): void;

  /**
   * Получение списка всех уведомлений
   * @returns массив уведомлений
   */
  getNotifications(): Notification[];

  /**
   * Добавление нового уведомления
   * @param message - сообщение уведомления
   * @param type - тип уведомления
   */
  addNotification(message: string, type: NotificationType): void;

  /**
   * Удаление уведомления
   * @param id - идентификатор удаляемого сообщения
   */
  deleteNotification(id: string): void;
}

/**
 * @implements {NotificationStore}
 */
export class NotificationStoreImpl implements NotificationStore {
  /**
   * Массив уведомлений пользователя
   */
  private readonly notifications: Notification[] = $state([]);

  /**
   * Видимости панели с уведомлениями
   */
  private notificationsVisibleFlag = $state(false);

  /**
   * @inheritDoc
   * @see {NotificationStore.notificationsVisible}
   */
  notificationsVisible(): boolean {
    return this.notificationsVisibleFlag;
  }

  /**
   * @inheritDoc
   * @see {NotificationStore.closeNotiffications}
   */
  closeNotiffications(): void {
    this.notificationsVisibleFlag = false;
  }

  /**
   * @inheritDoc
   * @see {NotificationStore.openNotiffications}
   */
  openNotiffications(): void {
    this.notificationsVisibleFlag = true;
  }

  /**
   * @inheritDoc
   * @see {NotificationStore.getNotifications}
   */
  getNotifications(): Notification[] {
    return this.notifications;
  }

  /**
   * @inheritDoc
   * @see {NotificationStore.addNotification}
   */
  addNotification(message: string, type: NotificationType): void {
    this.notifications.push({
      id: crypto.randomUUID(),
      message,
      type
    });
  }

  /**
   * @inheritDoc
   * @see {NotificationStore.deleteNotification}
   */
  deleteNotification(id: string): void {
    const index = this.notifications.findIndex(({ id: noteId }) => noteId === id);

    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }
}

/**
 * Регистрация в DI
 */
export const NOTIFICATION_STORE = diContainer.register<NotificationStore>(
  NotificationStoreImpl.name,
  new NotificationStoreImpl()
);
