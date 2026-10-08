import type { BigSerial, DbUserBoardRole } from '#app/repos/db/types';

/**
 * Сущность связи канбан доски и пользователя в БД
 */
export interface DbBoardsMembers {
  board_id: BigSerial;
  user_id: BigSerial;
  user_role: DbUserBoardRole;
}
