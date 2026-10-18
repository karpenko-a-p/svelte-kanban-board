import { TASKS_HTTP_CLIENT } from '#app/http/clients/tasks';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';
import { TASKS_STORE } from '#app/store/slices/tasks';

/**
 * Получение списка задач по доске и выбранному спринту
 * @param sprintId - идентификатор канбан доски
 * @param sprintId - идентификатор спринта
 */
export async function fetchTasks(boardId: string, sprintId: string): Promise<void> {
  const notificationStore = NOTIFICATION_STORE.get();
  const tasksHttpClient = TASKS_HTTP_CLIENT.get();
  const tasksStore = TASKS_STORE.get();

  if (!boardId) {
    notificationStore.addNotification('Не передан идентификтаор канбан доски', NotificationType.Warning);
    return;
  }

  if (!sprintId) {
    notificationStore.addNotification('Не передан идентификтаор спринта', NotificationType.Warning);
    return;
  }

  // Получение списка тасок
  const tasks = await tasksHttpClient.getTasksBySprintId(boardId, sprintId);

  if (tasks.isOk()) {
    tasksStore.setTasks(tasks.unwrap());
    return;
  }

  notificationStore.addNotification('Не удалось получить данные спринтов', NotificationType.Bad);
}
