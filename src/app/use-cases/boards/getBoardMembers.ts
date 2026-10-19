import { BOARDS_HTTP_CLIENT } from '#app/http/clients/boards';
import { BOARD_MEMBERS_STORE } from '#app/store/slices/boards';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';

/**
 * Получение списка участников канбан доски
 * @param boardId - идентификатор канбан доски
 */
export async function getBoardMembers(boardId: string): Promise<void> {
  const boardsHttpClient = BOARDS_HTTP_CLIENT.get();
  const notificationStore = NOTIFICATION_STORE.get();
  const membersStore = BOARD_MEMBERS_STORE.get();

  const members = await boardsHttpClient.getMembers(boardId);

  if (members.isOk()) {
    membersStore.setMembers(members.unwrap());
    return;
  }

  notificationStore.addNotification('Не удалось получить список участников', NotificationType.Bad);
}
