import { err, ok, type Res } from '#app/core/common';
import { SPRINTS_HTTP_CLIENT } from '#app/http/clients/sprints';
import { BackErr } from '#app/http/common-errors';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';
import { SPRINTS_STORE } from '#app/store/slices/sprints';

/**
 * Сценарий создания нового спринта
 * @param name - название спринта
 * @param startedAt - время начала спринта
 * @param finishedAt - время окончания спринта
 * @param boardId - доска куда будет привязан спринта
 * @returns Результат об успехе выполенния операции создания иои собщение об ошибке
 */
export async function createSprint(
  name: string,
  startedAt: string,
  finishedAt: string,
  boardId: string
): Promise<Res<null, string[]>> {
  const sprintsHttpClient = SPRINTS_HTTP_CLIENT.get();
  const sprintsStore = SPRINTS_STORE.get();
  const notificationStore = NOTIFICATION_STORE.get();

  // Создание спринта
  const createdSprint = await sprintsHttpClient.createSprint(name, startedAt, finishedAt, boardId);

  // Добавление спринта к списку
  if (createdSprint.isOk()) {
    notificationStore.addNotification('Создан новый спринт', NotificationType.Success);
    sprintsStore.addSprint(createdSprint.unwrap());
    return ok(null);
  }

  // Уведомление об ошибке
  const errors: string[] = createdSprint
    .mapErr((dto) => {
      if (dto instanceof BackErr.Validation) return dto.errors;
      if (dto instanceof BackErr.Forbidden) return ['Недостаточно прав для создания спринта'];
      return ['Неизвестная ошибка при создании спринта'];
    })
    .unwrapErr();

  notificationStore.addNotification(`Не удалось создат спринт: ${errors.join(', ')}`, NotificationType.Bad);

  return err(errors);
}
