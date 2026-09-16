import type { BigSerial } from '@app/repos/db/types';

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
