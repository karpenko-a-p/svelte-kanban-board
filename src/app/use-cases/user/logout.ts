import { USER_HTTP_CLIENT } from '#app/http/clients/user';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';
import type { Res } from '#app/core/common';

/**
 * Выход из аккаунта
 * @description Отправка запроса на очищение куки
 */
export async function logout(): Promise<Res<null, null>> {
  const notificationStore = NOTIFICATION_STORE.get();
  const userHttpClient = USER_HTTP_CLIENT.get();

  // Очистка куки
  const loggedOut = await userHttpClient.logout();

  // Обработка ответа
  return loggedOut
    .andThen(() => notificationStore.addNotification('Вы вышли из аккаунта', NotificationType.Neutral))
    .orElse(() => notificationStore.addNotification('Произошла ошибка при выходе из аккаунта', NotificationType.Bad))
    .map(() => null)
    .mapErr(() => null);
}
