import { err, ok, type Res } from '#app/core/common';
import { BOARDS_HTTP_CLIENT } from '#app/http/clients/boards';
import { BackErr } from '#app/http/common-errors';
import { BOARD_MEMBERS_STORE } from '#app/store/slices/boards';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';

/**
 * Удаление пользователя из списока участников канбан доски
 * @param userId - идентификатор пользователя
 * @param boardId - идентификатор доски
 */
export async function removeMemberFromBoard(userId: string, boardId: string): Promise<Res<null, string[]>> {
  const boardsHttpClient = BOARDS_HTTP_CLIENT.get();
  const notificationStore = NOTIFICATION_STORE.get();
  const membersStore = BOARD_MEMBERS_STORE.get();

  const memberRemoved = await boardsHttpClient.removeMemberFromBoard(boardId, userId);

  if (memberRemoved.isOk()) {
    membersStore.removeMember(userId);
    notificationStore.addNotification('Пользователь удален из участников доски', NotificationType.Success);
    return ok(null);
  }

  const errors: string[] = memberRemoved
    .mapErr((dto) => {
      if (dto instanceof BackErr.Validation) return dto.errors;
      if (dto instanceof BackErr.Forbidden) return ['Недостаточно прав для удаления пользователя'];
      return ['Неизвестная ошибка'];
    })
    .unwrapErr();

  notificationStore.addNotification(`Не удалось удалить пользователя: ${errors.join(', ')}`, NotificationType.Bad);
  return err(errors);
}
