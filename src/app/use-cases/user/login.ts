import { err, ok, type Res } from '#app/core/common';
import { LoginErr, USER_HTTP_CLIENT } from '#app/http/clients/user';
import { BackErr } from '#app/http/common-errors';
import { NOTIFICATION_STORE, NotificationType } from '#app/store/slices/notification';

/**
 * Авторизация пользователя в системе
 * @param login - логин пользователя
 * @param password - пароль пользователя
 * @returns null если авторизация прошла успшно, иначе массив ошибок
 * @description вызов api для авторизации пользователя и обработка ошибок при наличии 
 */
export async function loginUser(login: string, password: string): Promise<Res<null, string[]>> {
  const notificationStore = NOTIFICATION_STORE.get();
  const userHttpClient = USER_HTTP_CLIENT.get();

  const auth = await userHttpClient.login(login, password);

  if (auth.isOk()) {
    notificationStore.addNotification('Вы вошли в аккаунт', NotificationType.Success);
    return ok(null);
  }

  const errors = auth
    .mapErr((err) => {
      if (err instanceof BackErr.Validation) return err.errors;
      if (err instanceof LoginErr.UserNotExists) return ['Неверные логин или пароль'];
      return ['Неизвестная ошибка авторизации'];
    })
    .unwrapErr();

  notificationStore.addNotification(`Ошибка при попытке авторизации: ${errors.join(', ')}`, NotificationType.Bad);

  return err(errors);
}
