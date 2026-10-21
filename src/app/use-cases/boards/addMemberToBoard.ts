import { err, ok, type Res } from '#app/core/common';
import { BOARDS_HTTP_CLIENT } from '#app/http/clients/boards';
import { BackErr } from '#app/http/common-errors';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';

/**
 * Добавление пользователя в список участников канбан доски
 * @param userId - идентификатор пользователя
 * @param boardId - идентификатор доски
 */
export async function addMemberToBoard(userId: string, boardId: string): Promise<Res<null, string[]>> {
  const boardsHttpClient = BOARDS_HTTP_CLIENT.get();
  const notificationStore = NOTIFICATION_STORE.get();

  const memberAdded = await boardsHttpClient.addMemberToBoard(boardId, userId);

  if (memberAdded.isOk()) {
    notificationStore.addNotification('Пользователь добавлен в список участников доски', NotificationType.Success);
    return ok(null);
  }

  const errors: string[] = memberAdded
    .mapErr((dto) => {
      if (dto instanceof BackErr.Validation) return dto.errors;
      if (dto instanceof BackErr.NotFound) return ['Пользователь не найден'];
      if (dto instanceof BackErr.Forbidden) return ['Недостаточно прав для добавления пользователя'];
      return ['Неизвестная ошибка'];
    })
    .unwrapErr();

  notificationStore.addNotification(`Не удалось добавить пользователя: ${errors.join(', ')}`, NotificationType.Bad);
  return err(errors);
}
