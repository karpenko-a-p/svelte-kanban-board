import { ForbiddenErrorDto } from '#app/http/common-dtos/ForbiddenErrorDto.ts';
import { FORBIDDEN, OK } from '#app/http/constants';
import { extractUserId } from '#app/http/extractors';
import { BOARDS_REPO } from '#app/repos';
import type { RequestHandler } from '@sveltejs/kit';

// Сервисы и репы
const boardsRepo = BOARDS_REPO.get();

/**
 * Получение списка участников канбан доски
 */
export const GET: RequestHandler = async ({ params: { id: boardId }, locals }) => {
  const userId = extractUserId(locals);

  // Не авторизован
  if (userId.isErr()) {
    return userId.unwrapErr();
  }

  // Только участники доски могут видеть других участников
  if (!(await boardsRepo.checkIsMember(boardId!, userId.unwrap()))) {
    return Response.json(new ForbiddenErrorDto('Только участники доски могут видеть других участников'), {
      status: FORBIDDEN
    });
  }

  const members = await boardsRepo.getMembers(boardId!);

  return Response.json(members, { status: OK });
};
