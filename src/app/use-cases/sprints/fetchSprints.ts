import { SPRINTS_HTTP_CLIENT } from '#app/http/clients/sprints';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';
import { SPRINTS_STORE } from '#app/store/slices/sprints';

/**
 * Получение списка спринтов по идентификатору канбан доски
 * @param boardId - идентификатор канбан доски
 */
export async function fetchSprints(boardId: string): Promise<void> {
  const sprintsHttpClient = SPRINTS_HTTP_CLIENT.get();
  const sprintsStore = SPRINTS_STORE.get();
  const notificationStore = NOTIFICATION_STORE.get();

  // Получение списка спринтов
  const sprints = await sprintsHttpClient.getSprintsByBoardId(boardId);

  if (sprints.isOk()) {
    sprintsStore.setSprints(sprints.unwrap());
    return;
  }

  notificationStore.addNotification('Не удалось получить данные спринтов', NotificationType.Success);
}
