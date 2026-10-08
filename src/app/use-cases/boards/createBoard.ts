import { type Res } from '#app/core/common';
import { BOARDS_HTTP_CLIENT } from '#app/http/clients/boards';
import { BackErr } from '#app/http/common-errors';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';

/**
 * Создание новой канбан доски
 * @param name - назваание доски
 * @param description - описание доски
 * @returns идентфииктаор созданой канбан доски или сообщение об ошибке
 * @description Отправка запроса на создание новой канбан-доски и маппинг сообщения об ошибке с случае ошибки
 */
export async function createBoard(name: string, description: string): Promise<Res<string, string>> {
  const boardsStore = BOARDS_HTTP_CLIENT.get();
  const notificationStore = NOTIFICATION_STORE.get();

  const createdBoard = await boardsStore.createBoard(name, description);

  return createdBoard
    .map((board) => board.id)
    .andThen(() => notificationStore.addNotification('Вы успешно зарегистрировались!', NotificationType.Success))
    .mapErr((error) => (error instanceof BackErr.Validation ? error.errors.join(', ') : 'Внутренняя ошибка сервера'));
}
