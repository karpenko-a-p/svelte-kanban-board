/**
 * Тип данных big serial
 */
export type BigSerial = string;

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
