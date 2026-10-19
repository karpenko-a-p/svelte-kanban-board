import { diContainer } from '#app/core/common';
import { Task, type TaskStatus } from '#app/entities';
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

  /**
   * Получение списка спринтов по статусу
   * @param status - статус задач
   * @returns массив задач
   */
  getByStatus(status: TaskStatus): Task[];

  /**
   * Обновление статуса задачи
   * @param taskId - идентификатор задачи
   * @param status - устанавливаемый статус
   */
  updateTaskStatus(taskId: string, status: TaskStatus): void;
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
   * @see {TasksStore.getByStatus}
   */
  getByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  /**
   * @inheritdoc
   * @see {TasksStore.updateTaskStatus}
   */
  updateTaskStatus(taskId: string, status: TaskStatus): void {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      const newTask = Task.from(this.tasks[taskIndex])!;
      newTask.status = status;
      this.tasks[taskIndex] = newTask;
    }
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
export const TASKS_STORE = diContainer.register<TasksStore>(TasksStoreImpl.name, new TasksStoreImpl());
