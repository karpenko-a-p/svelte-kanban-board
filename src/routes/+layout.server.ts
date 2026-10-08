import { USER_REPO } from '#app/repos';
import type { LayoutServerLoad } from '#svelte-kit/$types';

// Сервисы и репозитории
const userRepo = USER_REPO.get();

/**
 * Получение авторизационных данных пользователя
 */
export const load: LayoutServerLoad = async ({ locals }) => {
  // Проверка авторизации пользователя
  if (!locals.userId) {
    return { plainUser: null };
  }

  // Получение данных пользователя
  const user = await userRepo.getUserById(locals.userId!);

  return { plainUser: user?.toPlain() };
};
