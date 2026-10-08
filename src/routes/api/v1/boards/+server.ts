import { BoardDto, CreateBoardDto } from '#app/http/clients/boards';
import { ServerErrorDto } from '#app/http/common-dtos';
import { CREATED, INTERNAL_SERVER_ERROR } from '#app/http/constants';
import { extractBody, extractUserId } from '#app/http/extractors';
import { BOARDS_REPO } from '#app/repos';
import type { RequestHandler } from '@sveltejs/kit';

// Сервисы и репы
const boardsRepo = BOARDS_REPO.get();

/**
 * Создание новой канбан доски
 * @description Создаание новой канбан-доски с указанием авторизованного пользователя как владельца
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  const userId = extractUserId(locals);

  // Не авторизован
  if (userId.isErr()) {
    return userId.unwrapErr();
  }

  const dto = await extractBody(request, CreateBoardDto);

  // Невалидный контракт
  if (dto.isErr()) {
    return dto.unwrapErr();
  }

  const { name, description } = dto.unwrap();

  // Создание новой канбан-доски
  const createdBoard = await boardsRepo.createBoard(name, description, userId.unwrap());

  if (createdBoard.isErr()) {
    return Response.json(new ServerErrorDto('Не удалось создать доску'), { status: INTERNAL_SERVER_ERROR });
  }

  return Response.json(BoardDto.fromBoard(createdBoard.unwrap()), { status: CREATED });
};
