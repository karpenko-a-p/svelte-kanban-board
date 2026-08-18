import { User } from '@app/entities';
import { userStore } from '@app/store/userStore';

/**
 * Создание пользователя
 * @param fio - ФИО пользователя
 */
export async function createUser(fio: string): Promise<void> {
  userStore.set(User.new('1', 'login', fio, new Date()));
}
