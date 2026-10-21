import { MemberActionDto } from '#app/http/clients/boards';
import { ForbiddenErrorDto, NotFoundErrorDto } from '#app/http/common-dtos';
import { FORBIDDEN, NOT_FOUND, OK } from '#app/http/constants';
import { extractBody, extractUserId } from '#app/http/extractors';
import { BOARDS_REPO, USER_REPO, UserBoardRole } from '#app/repos';
import type { RequestHandler } from '@sveltejs/kit';

// Сервисы и репы
const boardsRepo = BOARDS_REPO.get();
const usersRepo = USER_REPO.get();

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

/**
 * Добавление участника к доске
 */
export const POST: RequestHandler = async ({ params: { id: boardId }, request, locals }) => {
  const userId = extractUserId(locals);

  // Не авторизован
  if (userId.isErr()) {
    return userId.unwrapErr();
  }

  const dto = await extractBody(request, MemberActionDto);

  // Невалидный контракт
  if (dto.isErr()) {
    return dto.unwrapErr();
  }

  // Только участники доски могут добавлять других пользователей
  if (!(await boardsRepo.checkIsMember(boardId!, userId.unwrap()))) {
    return Response.json(new ForbiddenErrorDto('Только участники доски могут добавлять других пользователей'), {
      status: FORBIDDEN
    });
  }

  // Пользователя не существует
  if (!(await usersRepo.checkUserExistsById(dto.unwrap().userId))) {
    return Response.json(new NotFoundErrorDto('Пользователя не существует'), { status: NOT_FOUND });
  }

  // Добавление пользователя в список участников
  await boardsRepo.addMemberToBoard(boardId!, dto.unwrap().userId, UserBoardRole.Member);

  return Response.json(null, { status: OK });
};

/**
 * Удаление участника из участников доски
 */
export const DELETE: RequestHandler = async ({ params: { id: boardId }, request, locals }) => {
  const userId = extractUserId(locals);

  // Не авторизован
  if (userId.isErr()) {
    return userId.unwrapErr();
  }

  const dto = await extractBody(request, MemberActionDto);

  // Невалидный контракт
  if (dto.isErr()) {
    return dto.unwrapErr();
  }

  // Только участники доски могут удалять других пользователей
  if (!(await boardsRepo.checkIsMember(boardId!, userId.unwrap()))) {
    return Response.json(new ForbiddenErrorDto('Только участники доски могут удалять других пользователей'), {
      status: FORBIDDEN
    });
  }

  // Добавление пользователя в список участников
  await boardsRepo.removeMemberFromBoard(boardId!, dto.unwrap().userId);

  return Response.json(null, { status: OK });
};
