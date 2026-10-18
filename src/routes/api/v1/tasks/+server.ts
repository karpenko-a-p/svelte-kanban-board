import { CreateTaskDto, TaskDto } from '#app/http/clients/tasks';
import { BadRequestErrorDto, ForbiddenErrorDto, ServerErrorDto } from '#app/http/common-dtos';
import { BAD_REQUEST, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, OK } from '#app/http/constants';
import { extractBody, extractUserId } from '#app/http/extractors';
import { BOARDS_REPO, TASKS_REPO } from '#app/repos';
import type { RequestHandler } from '@sveltejs/kit';

// Сервисы и репы
const boardsRepo = BOARDS_REPO.get();
const tasksRepo = TASKS_REPO.get();

/**
 * Создание задачи
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  const userId = extractUserId(locals);

  // Не авторизован
  if (userId.isErr()) {
    return userId.unwrapErr();
  }

  const dto = await extractBody(request, CreateTaskDto);

  // Невалидный контракт
  if (dto.isErr()) {
    return dto.unwrapErr();
  }

  const { name, description, priority, assignedId, reporterId, sprintId, boardId } = dto.unwrap();

  // Только участники доски могут создавать задачи
  if (!(await boardsRepo.checkIsMember(boardId, userId.unwrap()))) {
    return Response.json(new ForbiddenErrorDto('Только участники доски могут создавать задачи'), { status: FORBIDDEN });
  }

  // Спринт не привязан к данной доске
  if (!(await boardsRepo.checkBoardOwnsSprint(boardId, sprintId))) {
    return Response.json(new BadRequestErrorDto('Спринт не привязан к данной доске'), { status: FORBIDDEN });
  }

  // Создание задачи
  const createdTask = await tasksRepo.createTask({
    name,
    description,
    priority,
    sprintId,
    reporterId,
    assignedId
  });

  if (createdTask.isErr()) {
    return Response.json(new ServerErrorDto('Не удалось создать задачу'), { status: INTERNAL_SERVER_ERROR });
  }

  return Response.json(TaskDto.fromTask(createdTask.unwrap()), { status: CREATED });
};

/**
 * Получение задач
 */
export const GET: RequestHandler = async ({ url, locals }) => {
  const userId = extractUserId(locals);

  // Не авторизован
  if (userId.isErr()) {
    return userId.unwrapErr();
  }

  const boardId = url.searchParams.get('board-id');
  const sprintId = url.searchParams.get('sprint-id');

  if (!boardId || !sprintId) {
    return Response.json(new BadRequestErrorDto('Не установлен идентификатор доски или cпринта'), {
      status: BAD_REQUEST
    });
  }

  // Только участники доски могут получить доступ к задачам ее спринтов
  if (!(await boardsRepo.checkIsMember(boardId, userId.unwrap()))) {
    return Response.json(new ForbiddenErrorDto('Только участники доски могут получить доступ к задачам ее спринтов'), {
      status: FORBIDDEN
    });
  }

  // Спринт не привязан к данной доске
  if (!(await boardsRepo.checkBoardOwnsSprint(boardId, sprintId))) {
    return Response.json(new BadRequestErrorDto('Спринт не привязан к данной доске'), { status: FORBIDDEN });
  }

  const tasks = await tasksRepo.getTasksBySprintId(sprintId);

  return Response.json(tasks.map(TaskDto.tryParse).removeNil(), { status: OK });
};
