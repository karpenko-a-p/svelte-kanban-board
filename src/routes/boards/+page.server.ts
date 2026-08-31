import { BOARD_REPO } from '@app/repos';
import type { PageServerLoad } from '@svelte-kit/boards/$types';
import { redirect } from '@sveltejs/kit';

// Сервисы и репозитории
const boardsRepo = BOARD_REPO.get();

/**
 * Получение данных по доскам, доступным пользователю
 */
export const load: PageServerLoad = async ({ locals }) => {
  // Пользователь не авторизован
  if (!locals.userId) {
    redirect(302, '/');
  }

  // Получение канбан досок
  const boards = await boardsRepo.getBoardsByUserId(locals.userId);
  const plainBoards = boards.map((board) => board.toPojo());

  return { plainBoards };
};
