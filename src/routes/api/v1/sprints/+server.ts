import { SprintDto } from '@app/http/clients/sprints';
import { CreateSprintDto } from '@app/http/clients/sprints/CreateSprintDto';
import { ForbiddenErrorDto, ServerErrorDto } from '@app/http/common-dtos';
import { CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR } from '@app/http/constants';
import { extractBody, extractUserId } from '@app/http/extractors';
import { BOARDS_REPO, SPRINTS_REPO } from '@app/repos';
import { json, type RequestHandler } from '@sveltejs/kit';

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
    return json(new ForbiddenErrorDto(), { status: FORBIDDEN });
  }

  const createdSprint = await sprintsRepo.createSprint(name, startedAt, finishedAt, boardId);

  if (createdSprint.isErr()) {
    return json(new ServerErrorDto('Не удалось создать спринт'), { status: INTERNAL_SERVER_ERROR });
  }

  return json(SprintDto.fromSprint(createdSprint.unwrap()), { status: CREATED });
};
