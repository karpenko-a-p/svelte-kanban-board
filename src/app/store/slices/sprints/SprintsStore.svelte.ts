import { diContainer } from '#app/core/common';
import type { Sprint } from '#app/entities';
import type { Clearable } from '#app/store/interfaces';

/**
 * Хранилище для списка спринтов
 */
export interface SprintsStore extends Clearable {
  /**
   * Установка списка спринтов
   * @param sprints - массив спринтов
   */
  setSprints(sprints: Sprint[]): void;

  /**
   *  Получение списка спринтов
   * @returns массив спринтов
   */
  getSprints(): Readonly<Sprint>[];

  /**
   * Добавление спринта к списку спринтов
   * @param sprint - добавляемый спринт
   */
  addSprint(sprint: Sprint): void;
}

/**
 * @implements {SprintsStore}
 */
class SprintsStoreImpl implements SprintsStore {
  /**
   * Массив хранимых спринтов
   */
  private sprints: Sprint[] = $state([]);

  /**
   * @inheritdoc
   * @see {SprintsStore.setSprints}
   */
  setSprints(sprints: Sprint[]): void {
    this.sprints = sprints;
  }

  /**
   * @inheritdoc
   * @see {SprintsStore.getSprints}
   */
  getSprints(): Sprint[] {
    return this.sprints;
  }

  /**
   * @inheritdoc
   * @see {SprintsStore.addSprint}
   */
  addSprint(sprint: Sprint): void {
    this.sprints.push(sprint);
  }

  /**
   * @inheritdoc
   * @see {Clearable.clear}
   */
  clear(): void {
    this.sprints = [];
  }
}

/**
 * Регистрация в DI
 */
export const SPRINTS_STORE = diContainer.register(SprintsStoreImpl.name, new SprintsStoreImpl());
