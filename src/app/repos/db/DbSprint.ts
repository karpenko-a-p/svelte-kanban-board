import type { BigSerial } from '@app/repos/db/types';

/**
 * Сущность спринта в БД
 */
export interface DbSprint {
  id: BigSerial;
  name: string;
  started_at: Date;
  finished_at: Date;
  board_id: BigSerial;
}
