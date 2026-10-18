import { err, ok, type Res } from '#app/core/common';
import { SPRINTS_HTTP_CLIENT } from '#app/http/clients/sprints';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';
import { SPRINTS_STORE } from '#app/store/slices/sprints';

/**
 * Получение списка спринтов по идентификатору канбан доски
 * @param boardId - идентификатор канбан доски
 * @returns Идентификатор последнего спринта или ничего
 */
export async function fetchSprints(boardId: string): Promise<Res<string, null>> {
  const sprintsHttpClient = SPRINTS_HTTP_CLIENT.get();
  const sprintsStore = SPRINTS_STORE.get();
  const notificationStore = NOTIFICATION_STORE.get();

  if (!boardId) {
    notificationStore.addNotification('Не передан идентификтаор канбан доски', NotificationType.Warning);
    return err(null);
  }

  // Получение списка спринтов
  const sprints = await sprintsHttpClient.getSprintsByBoardId(boardId);

  if (sprints.isOk()) {
    sprintsStore.setSprints(sprints.unwrap());
    const lastSprintId = sprints.unwrap().at(-1)?.id || '';
    return ok(lastSprintId);
  }

  notificationStore.addNotification('Не удалось получить данные спринтов', NotificationType.Bad);
  return err(null);
}
