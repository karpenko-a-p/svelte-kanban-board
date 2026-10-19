import { err, ok, type Res } from '#app/core/common';
import { TASKS_HTTP_CLIENT, type CreateTaskDto } from '#app/http/clients/tasks';
import { BackErr } from '#app/http/common-errors';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';
import { TASKS_STORE } from '#app/store/slices/tasks';
import type { Task } from '#app/entities';

/**
 * Сценарий создания новой таски
 * @param dto - данные для созждания задачи
 * @returns Результат об успехе выполенния операции создания или собщение об ошибке
 */
export async function createTask(dto: Omit<CreateTaskDto, 'validate'>): Promise<Res<Task, string[]>> {
  const notificationStore = NOTIFICATION_STORE.get();
  const tasksHttpClient = TASKS_HTTP_CLIENT.get();
  const tasksStore = TASKS_STORE.get();

  // Создание задачи
  const createdTask = await tasksHttpClient.createTask(dto);

  if (createdTask.isOk()) {
    notificationStore.addNotification('Создан новая задача', NotificationType.Success);
    tasksStore.addTask(createdTask.unwrap());
    return ok(createdTask.unwrap());
  }

  // Уведомление об ошибке
  const errors: string[] = createdTask
    .mapErr((dto) => {
      if (dto instanceof BackErr.Validation) return dto.errors;
      if (dto instanceof BackErr.Forbidden) return ['Недостаточно прав для создания задачи'];
      return ['Неизвестная ошибка при создании задачи'];
    })
    .unwrapErr();

  notificationStore.addNotification(`Не удалось создат задачу: ${errors.join(', ')}`, NotificationType.Bad);

  return err(errors);
}
