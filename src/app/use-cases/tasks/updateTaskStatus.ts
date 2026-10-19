import { TASKS_HTTP_CLIENT } from '#app/http/clients/tasks';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';
import { TASKS_STORE } from '#app/store/slices/tasks';
import type { TaskStatus } from '#app/entities';

/**
 * Обновление статуса задачи
 * @param boardId - идентификатор канбан доски
 * @param taskId - идентификатор задачи
 * @param status - устанавливаемый статус
 */
export async function updateTaskStatus(boardId: string, taskId: string, status: TaskStatus): Promise<void> {
  const notificationStore = NOTIFICATION_STORE.get();
  const tasksHttpClient = TASKS_HTTP_CLIENT.get();
  const tasksStore = TASKS_STORE.get();

  const updatedTask = await tasksHttpClient.updateTaskStatus(boardId, taskId, status);

  // Статус задачи обновлен
  if (updatedTask.isOk()) {
    tasksStore.updateTaskStatus(taskId, status);
    notificationStore.addNotification('Статус задачи обновлен', NotificationType.Success);
    return;
  }

  notificationStore.addNotification('Не удалось обновить статус задачи', NotificationType.Bad);
}
