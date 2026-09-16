import type { BigSerial } from '@app/repos/db/types';

/**
 * Сущность канбан доски в БД
 */
export interface DbBoard {
  id: BigSerial;
  name: string;
  description: string;
}
