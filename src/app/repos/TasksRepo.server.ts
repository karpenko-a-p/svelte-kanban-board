import { diContainer, type Res } from '#app/core/common';
import { postgres } from './utils';
import { TaskPriority, type Task, type TaskStatus } from '#app/entities';
import { DbTaskPriority, type DbTask } from './db';

/**
 * DTO данных для создания задачи
 */
export type CreateTaskDto = {
  name: string;
  description: string;
  priority: TaskPriority;
  sprintId: string;
  reporterId: string;
  assignedId: string;
};

/**
 * Репозиторий для работы с задачами
 */
export interface TasksRepo {
  /**
   * Создание задачи
   * @param dto - данные для создания задачи
   * @returns новая таска или соообщение об ошибке
   */
  createTask(dto: CreateTaskDto): Promise<Res<Task, string>>;

  /**
   * Получение задач по определеному спринту
   * @param sprintId - идентификатор спринта
   * @returns массив тасок
   */
  getTasksBySprintId(sprintId: string): Promise<Task[]>;

  /**
   * Обновление статуса задачи
   * @param taskId - идекнтификатор задачи
   * @param status - устанавливаемый статус
   * @returns обновленная таска или соообщение об ошибке
   */
  updateTaskStatus(taskId: string, status: TaskStatus): Promise<Res<Task, string>>;
}

/**
 * @implements {TasksRepo}
 */
class TasksRepoImpl implements TasksRepo {
  /**
   * Приведение приоритета задачи из сущности в БД к модели
   * @param dbPriority - приоритет задачи из БД
   * @returns приоритет задачи для модели
   */
  private static priorityParse(dbPriority: DbTaskPriority): TaskPriority {
    if (dbPriority === DbTaskPriority.High) return TaskPriority.High;
    if (dbPriority === DbTaskPriority.Medium) return TaskPriority.Medium;
    if (dbPriority === DbTaskPriority.Low) return TaskPriority.Low;
    throw new TypeError('Не удалось удалось преобразовать приоритет задачи (DbTaskPriority -> TaskPriority)');
  }

  /**
   * Приведение приоритета задачи модели к сущности в БД
   * @param dbPriority - приоритет задачи модели
   * @returns приоритет задачи в БД
   */
  private static dbPriorityParse(dbPriority: TaskPriority): DbTaskPriority {
    if (dbPriority === TaskPriority.High) return DbTaskPriority.High;
    if (dbPriority === TaskPriority.Medium) return DbTaskPriority.Medium;
    if (dbPriority === TaskPriority.Low) return DbTaskPriority.Low;
    throw new TypeError('Не удалось удалось преобразовать приоритет задачи (TaskPriority -> DbTaskPriority)');
  }

  /**
   * @inheritdoc
   * @see {TasksRepo.createTask}
   */
  async createTask(dto: CreateTaskDto): Promise<Res<Task, string>> {
    const [row] = await postgres<DbTask[]>`
      insert into tasks (name, description, priority, sprint_id, reporter_id, assigned_id)
      values (${dto.name}, ${dto.description}, ${TasksRepoImpl.dbPriorityParse(dto.priority)}, ${dto.sprintId}, ${dto.reporterId}, ${dto.assignedId})
      returning id, name, description, status, priority, sprint_id, reporter_id, assigned_id`;

    // TODO
  }

  /**
   * @inheritdoc
   * @see {TasksRepo.getTasksBySprintId}
   */
  getTasksBySprintId(sprintId: string): Promise<Task[]> {
    throw new Error('Method not implemented.');
  }

  /**
   * @inheritdoc
   * @see {TasksRepo.updateTaskStatus}
   */
  updateTaskStatus(taskId: string, status: TaskStatus): Promise<Res<Task, string>> {
    throw new Error('Method not implemented.');
  }
}

/**
 * Регистрация в DI
 */
export const TASKS_REPO = diContainer.register<TasksRepo>(TasksRepoImpl.name, new TasksRepoImpl());
