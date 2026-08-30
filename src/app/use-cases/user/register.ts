import { err, ok, type Res } from '@app/core/common';
import { RegisterErr, USER_HTTP_CLIENT } from '@app/http/clients/user';
import { BackErr } from '@app/http/common-errors';
import { NOTIFICATION_STORE, NotificationType } from '@app/store/slices/notification';

/**
 * Регистрация пользователя в системе
 * @param login - логин пользователя
 * @param fio - ФИО пользователя
 * @param password - пароль пользователя
 * @returns null если регистрация прошла успшно, иначе массив ошибок
 * @description вызов api для регистрации пользователя и обработка ошибок при наличии 
 */
export async function registerUser(login: string, fio: string, password: string): Promise<Res<null, string[]>> {
  const notificationStore = NOTIFICATION_STORE.get();
  const userHttpClient = USER_HTTP_CLIENT.get();

  const auth = await userHttpClient.register(login, fio, password);

  if (auth.isOk()) {
    notificationStore.addNotification('Вы успешно зарегистрировались!', NotificationType.Success);
    return ok(null);
  }

  const errors = auth
    .mapErr((err) => {
      if (err instanceof BackErr.Validation) return err.errors;
      if (err instanceof RegisterErr.UserExists) return ['Пользователь с таким логином уже существует'];
      return ['Неизвестная ошибка авторизации'];
    })
    .unwrapErr();

  notificationStore.addNotification(`Ошибка при попытке регистрации: ${errors.join(', ')}`, NotificationType.Bad);

  return err(errors);
}
