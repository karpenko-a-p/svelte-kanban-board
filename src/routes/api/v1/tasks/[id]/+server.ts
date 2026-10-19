import { TaskDto, UpdateTaskStatusDto } from '#app/http/clients/tasks';
import { BadRequestErrorDto, ForbiddenErrorDto, ServerErrorDto } from '#app/http/common-dtos';
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, OK } from '#app/http/constants';
import { extractBody, extractUserId } from '#app/http/extractors';
import { BOARDS_REPO, TASKS_REPO } from '#app/repos';
import type { RequestHandler } from '@sveltejs/kit';

// Сервисы и репы
const boardsRepo = BOARDS_REPO.get();
const tasksRepo = TASKS_REPO.get();

/**
 * Обновление статуса задачи
 */
export const PATCH: RequestHandler = async ({ url, params: { id: taskId }, locals, request }) => {
  const userId = extractUserId(locals);

  // Не авторизован
  if (userId.isErr()) {
    return userId.unwrapErr();
  }

  const dto = await extractBody(request, UpdateTaskStatusDto);

  // Невалидный контракт
  if (dto.isErr()) {
    return dto.unwrapErr();
  }

  const boardId = url.searchParams.get('board-id');

  if (!boardId) {
    return Response.json(new BadRequestErrorDto('Не установлен идентификатор доски или cпринта'), {
      status: BAD_REQUEST
    });
  }

  // Только участники доски могут получить доступ к задачам
  if (!(await boardsRepo.checkIsMember(boardId, userId.unwrap()))) {
    return Response.json(new ForbiddenErrorDto('Только участники доски могут получить доступ к задачам'), {
      status: FORBIDDEN
    });
  }

  // Задача не привязана к данной доске
  if (!(await boardsRepo.checkBoardOwnsTask(boardId, taskId!))) {
    return Response.json(new BadRequestErrorDto('Задача не привязана к данной доске'), { status: FORBIDDEN });
  }

  const updatedTask = await tasksRepo.updateTaskStatus(taskId!, dto.unwrap().status);

  if (updatedTask.isErr()) {
    return Response.json(new ServerErrorDto('Не удалось обновить статус задачи'), { status: INTERNAL_SERVER_ERROR });
  }

  return Response.json(TaskDto.fromTask(updatedTask.unwrap()), { status: OK });
};
