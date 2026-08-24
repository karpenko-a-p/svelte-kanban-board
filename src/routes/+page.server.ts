import { FOUND } from '@app/http/constants';
import type { PageServerLoad } from '@svelte-kit/$types';
import { redirect } from '@sveltejs/kit';

/**
 * Страница авторизации пользователя
 * @description Если пользователь авторизован, то перевести его на страницу с досками
 */
export const load: PageServerLoad = ({ locals }) => {
  if (locals.isAuth) {
    redirect(FOUND, '/boards');
  }
};
