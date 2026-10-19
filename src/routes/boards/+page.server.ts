import { toPlain } from '#app/core/common';
import { BOARDS_REPO } from '#app/repos';
import type { PageServerLoad } from '#svelte-kit/boards/$types';

// Сервисы и репозитории
const boardsRepo = BOARDS_REPO.get();

/**
 * Получение данных по доскам, доступным пользователю
 * @returns массив канбан досок
 */
export const load: PageServerLoad = async ({ locals }) => {
  // Получение канбан досок
  const boards = await boardsRepo.getBoardsByUserId(locals.userId!);
  const plainBoards = boards.map(toPlain);

  return { plainBoards };
};
