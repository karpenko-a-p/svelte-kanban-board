/**
 * Тип данных big serial
 */
export type BigSerial = string;

/**
 * Роль пользователя для канбан доски
 */
export const enum DbUserBoardRole {
  Owner = 'Owner',
  Member = 'Member'
}

/**
 * Сущность пользователя в таблице users
 */
export interface DbUser {
  id: BigSerial;
  login: string;
  fio: string;
  password: string;
  created_at: Date;
}

/**
 * Сущность канбан доски в БД
 */
export interface DbBoard {
  id: BigSerial;
  name: string;
  description: string;
}

/**
 * Сущность связи канбан доски и пользователя в БД
 */
export interface DbBoardsMembers {
  board_id: BigSerial;
  user_id: BigSerial;
  user_role: DbUserBoardRole;
}
