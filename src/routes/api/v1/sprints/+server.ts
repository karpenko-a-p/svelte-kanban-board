import { SprintDto } from '#app/http/clients/sprints';
import { CreateSprintDto } from '#app/http/clients/sprints/CreateSprintDto';
import { BadRequestErrorDto, ForbiddenErrorDto, ServerErrorDto } from '#app/http/common-dtos';
import { BAD_REQUEST, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, OK } from '#app/http/constants';
import { extractBody, extractUserId } from '#app/http/extractors';
import { BOARDS_REPO, SPRINTS_REPO } from '#app/repos';
import type { RequestHandler } from '@sveltejs/kit';

// Сервисы и репы
const sprintsRepo = SPRINTS_REPO.get();
const boardsRepo = BOARDS_REPO.get();

/**
 * Создание нового спринта
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  const userId = extractUserId(locals);

  // Не авторизован
  if (userId.isErr()) {
    return userId.unwrapErr();
  }

  const dto = await extractBody(request, CreateSprintDto);

  // Невалидный контракт
  if (dto.isErr()) {
    return dto.unwrapErr();
  }

  const { name, startedAt, finishedAt, boardId } = dto.unwrap();

  // Только участники доски могут создать новый спринт
  if (!(await boardsRepo.checkIsMember(boardId, userId.unwrap()))) {
    return Response.json(new ForbiddenErrorDto(), { status: FORBIDDEN });
  }

  const createdSprint = await sprintsRepo.createSprint(name, startedAt, finishedAt, boardId);

  if (createdSprint.isErr()) {
    return Response.json(new ServerErrorDto('Не удалось создать спринт'), { status: INTERNAL_SERVER_ERROR });
  }

  return Response.json(SprintDto.fromSprint(createdSprint.unwrap()), { status: CREATED });
};

/**
 * Получения списка спринтов канбан доски
 */
export const GET: RequestHandler = async ({ locals, url }) => {
  const userId = extractUserId(locals);

  // Не авторизован
  if (userId.isErr()) {
    return userId.unwrapErr();
  }

  const boardId = url.searchParams.get('board-id');

  if (!boardId) {
    return Response.json(new BadRequestErrorDto('Не установлен идентификатор доски'), { status: BAD_REQUEST });
  }

  // Только участники доски могут получить список спринтов
  if (!(await boardsRepo.checkIsMember(boardId, userId.unwrap()))) {
    return Response.json(new ForbiddenErrorDto(), { status: FORBIDDEN });
  }

  const sprints = await sprintsRepo.getSprintsByBoardId(boardId);

  return Response.json(sprints.map(SprintDto.tryParse).removeNil(), { status: OK });
};
