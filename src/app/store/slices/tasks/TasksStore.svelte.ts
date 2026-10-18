import { diContainer } from '#app/core/common';
import type { Task } from '#app/entities';
import type { Clearable } from '#app/store/interfaces';

/**
 * Хранилище для списка задач
 */
export interface TasksStore extends Clearable {
  /**
   * Установка списка задач
   * @param tasks - массив задач
   */
  setTasks(tasks: Task[]): void;

  /**
   *  Получение списка задач
   * @returns массив задач
   */
  getTasks(): Readonly<Task>[];

  /**
   * Добавление спринта к списку задач
   * @param task - добавляемый задача
   */
  addTask(task: Task): void;
}

/**
 * @implements {TasksStore}
 */
class TasksStoreImpl implements TasksStore {
  /**
   * Массив хранимых задач
   */
  private tasks: Task[] = $state([]);

  /**
   * @inheritdoc
   * @see {TasksStore.setTasks}
   */
  setTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }

  /**
   * @inheritdoc
   * @see {TasksStore.getTasks}
   */
  getTasks(): Readonly<Task>[] {
    return this.tasks;
  }

  /**
   * @inheritdoc
   * @see {TasksStore.addTask}
   */
  addTask(task: Task): void {
    this.tasks.push(task);
  }

  /**
   * @inheritdoc
   * @see {Clearable.clear}
   */
  clear(): void {
    this.tasks = [];
  }
}

/**
 * Регистрация в DI
 */
export const TASKS_STORE = diContainer.register(TasksStoreImpl.name, new TasksStoreImpl());
