import { error } from '@sveltejs/kit';
import { Board } from '#app/entities';
import type { PageLoad } from '#svelte-kit/boards/[id]/$types';

export const ssr = false;

/**
 * Преобраазование данных для отображения страницы
 * @returns канбан доска
 */
export const load: PageLoad = ({ data }) => {
  const board = Board.tryParse(data.plainBoard);

  if (!board) {
    error(500, 'Невозможно преобразовать данные канбан доски');
  }

  return { board };
};
