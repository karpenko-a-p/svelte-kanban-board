import { User } from '#app/entities';
import type { LayoutLoad } from '#svelte-kit/$types';

/**
 * Преобразование данных пользователя, если авторизован
 * @returns данные пользователя
 */
export const load: LayoutLoad = ({ data }) => ({ user: User.tryParse(data.plainUser) });
