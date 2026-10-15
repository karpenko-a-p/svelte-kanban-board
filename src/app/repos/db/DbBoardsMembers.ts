import type { BigSerial } from '#app/repos/db/types';

/**
 * Роль пользователя для канбан доски
 */
export const enum DbUserBoardRole {
  // Владелец
  Owner = 'Owner',
  // Участник
  Member = 'Member'
}

/**
 * Сущность связи канбан доски и пользователя в БД
 */
export interface DbBoardsMembers {
  board_id: BigSerial;
  user_id: BigSerial;
  user_role: DbUserBoardRole;
}
