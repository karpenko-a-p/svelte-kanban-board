import { FOUND } from '@app/http/constants';
import { BOARDS_REPO } from '@app/repos';
import type { PageServerLoad } from '@svelte-kit/boards/[id]/$types';
import { redirect } from '@sveltejs/kit';

// Сервисы и репозитории
const boardsRepo = BOARDS_REPO.get();

/**
 * Получение списка спринтов
 * @returns массив спринтов
 */
export const load: PageServerLoad = async ({ locals, params: { id: boardId } }) => {
  // Пользователь не авторизован
  if (!locals.userId) {
    redirect(FOUND, '/');
  }

  const [hasAccess, board] = await Promise.all([
    // Проверка досутпа пользователя
    boardsRepo.checkIsMember(boardId, locals.userId),
    // Получение данных доски
    boardsRepo.getBoardById(boardId)
  ]);

  if (!hasAccess || !board) {
    redirect(FOUND, '/');
  }

  return { plainBoard: board.toPlain() };
};
