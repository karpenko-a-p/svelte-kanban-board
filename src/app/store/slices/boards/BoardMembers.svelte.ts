import { diContainer } from '#app/core/common';
import type { User } from '#app/entities';
import type { Clearable } from '#app/store/interfaces';

/**
 * Хранилище для списка участников спринта
 */
export interface BoardMembers extends Clearable {
  /**
   * Установка списка участников спринта
   * @param members - массив участников спринта
   */
  setMembers(members: User[]): void;

  /**
   * Получение списка участников спринта
   * @returns массив участников спринта
   */
  getMembers(): Readonly<User>[];

  /**
   * Добавление участника к списку участников спринта
   * @param member - добавляемый участник
   */
  addMember(member: User): void;
}

/**
 * @implements {BoardMembers}
 */
class BoardMembersImpl implements BoardMembers {
  /**
   * Массив хранимых участников
   */
  private members: User[] = $state([]);

  /**
   * @inheritdoc
   * @see {BoardMembers.setMembers}
   */
  setMembers(members: User[]): void {
    this.members = members;
  }

  /**
   * @inheritdoc
   * @see {BoardMembers.setMembers}
   */
  getMembers(): Readonly<User>[] {
    return this.members;
  }

  /**
   * @inheritdoc
   * @see {BoardMembers.setMembers}
   */
  addMember(member: User): void {
    this.members.push(member);
  }

  /**
   * @inheritdoc
   * @see {BoardMembers.setMembers}
   */
  clear(): void {
    this.members = [];
  }
}

/**
 * Регистрация в DI
 */
export const BOARD_MEMBERS_STORE = diContainer.register<BoardMembers>(BoardMembersImpl.name, new BoardMembersImpl());
