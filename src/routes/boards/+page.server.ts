import { FOUND } from '@app/http/constants';
import { BOARDS_REPO } from '@app/repos';
import type { PageServerLoad } from '@svelte-kit/boards/$types';
import { redirect } from '@sveltejs/kit';

// Сервисы и репозитории
const boardsRepo = BOARDS_REPO.get();

/**
 * Получение данных по доскам, доступным пользователю
 * @returns массив канбан досок
 */
export const load: PageServerLoad = async ({ locals }) => {
  // Пользователь не авторизован
  if (!locals.userId) {
    redirect(FOUND, '/');
  }

  // Получение канбан досок
  const boards = await boardsRepo.getBoardsByUserId(locals.userId);
  const plainBoards = boards.map((board) => board.toPlain());

  return { plainBoards };
};
