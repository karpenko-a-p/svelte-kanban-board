import { Board } from '#app/entities';
import type { PageLoad } from '#svelte-kit/boards/$types';

/**
 * Преобраазование данных для отображения страницы со списком доступных досок
 * @returns список досок
 */
export const load: PageLoad = ({ data }) => ({ boards: data.plainBoards.map(Board.tryParse).removeNil() });
