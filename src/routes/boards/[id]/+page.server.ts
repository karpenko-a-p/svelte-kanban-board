import { toPlain } from '@app/core/common';
import { FOUND } from '@app/http/constants';
import { BOARDS_REPO, SPRINTS_REPO } from '@app/repos';
import type { PageServerLoad } from '@svelte-kit/boards/[id]/$types';
import { redirect } from '@sveltejs/kit';

// Сервисы и репозитории
const boardsRepo = BOARDS_REPO.get();
const sprintsRepo = SPRINTS_REPO.get();

/**
 * Получение списка спринтов
 * @returns массив спринтов
 */
export const load: PageServerLoad = async ({ locals, params: { id: boardId } }) => {
  // Пользователь не авторизован
  if (!locals.userId) {
    redirect(FOUND, '/');
  }

  const [hasAccess, board, sprints] = await Promise.all([
    // Проверка досутпа пользователя
    boardsRepo.checkIsMember(boardId, locals.userId),
    // Получение данных доски
    boardsRepo.getBoardById(boardId),
    // Получение списка спринтов
    sprintsRepo.getSprintsByBoardId(boardId)
  ]);

  if (!hasAccess || !board) {
    redirect(FOUND, '/');
  }

  return {
    plainBoard: board.toPlain(),
    plainSprints: sprints.map(toPlain)
  };
};
