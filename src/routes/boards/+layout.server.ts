import { redirect } from '@sveltejs/kit';
import { FOUND } from '#app/http/constants';
import type { LayoutServerLoad } from '#svelte-kit/boards/$types';

/**
 * Проверка существования данных пользователыя
 */
export const load: LayoutServerLoad = async ({ locals }) => {
  // Пользователь не авторизован
  if (!locals.userId) {
    redirect(FOUND, '/');
  }
};
