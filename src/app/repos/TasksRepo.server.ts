import { diContainer, err, ok, panic, type Res } from '#app/core/common';
import { TaskPriority, Task, TaskStatus } from '#app/entities';
import { DbTaskPriority, DbTaskStatus, type DbTask } from './db';
import { postgres, redis, REDIS_HOUR, redisGet, redisSet } from './utils';

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
    panic('Не удалось удалось преобразовать приоритет задачи (DbTaskPriority -> TaskPriority)');
  }

  /**
   * Приведение приоритета задачи модели к сущности в БД
   * @param priority - приоритет задачи модели
   * @returns приоритет задачи в БД
   */
  private static dbPriorityParse(priority: TaskPriority): DbTaskPriority {
    if (priority === TaskPriority.High) return DbTaskPriority.High;
    if (priority === TaskPriority.Medium) return DbTaskPriority.Medium;
    if (priority === TaskPriority.Low) return DbTaskPriority.Low;
    panic('Не удалось удалось преобразовать приоритет задачи (TaskPriority -> DbTaskPriority)');
  }

  /**
   * Приведение статуса задачи из сущности в БД к модели
   * @param dbStatus - статус задачи из БД
   * @returns статус задачи для модели
   */
  private static statusParse(dbStatus: DbTaskStatus): TaskStatus {
    if (dbStatus === DbTaskStatus.Done) return TaskStatus.Done;
    if (dbStatus === DbTaskStatus.InProgress) return TaskStatus.InProgress;
    if (dbStatus === DbTaskStatus.NotStarted) return TaskStatus.NotStarted;
    panic('Не удалось удалось преобразовать статус задачи (DbTaskStatus -> TaskStatus)');
  }

  /**
   * Приведение статуса задачи модели к сущности в БД
   * @param status - статус задачи модели
   * @returns статус задачи в БД
   */
  private static dbStatusParse(status: TaskStatus): DbTaskStatus {
    if (status === TaskStatus.Done) return DbTaskStatus.Done;
    if (status === TaskStatus.InProgress) return DbTaskStatus.InProgress;
    if (status === TaskStatus.NotStarted) return DbTaskStatus.NotStarted;
    panic('Не удалось удалось преобразовать статус задачи (TaskStatus -> DbTaskStatus)');
  }

  /**
   * @inheritdoc
   * @see {TasksRepo.createTask}
   */
  async createTask(dto: CreateTaskDto): Promise<Res<Task, string>> {
    const [{ id: createdTaskId = null }] = await postgres<Pick<DbTask, 'id'>[]>`
      insert into tasks (name, description, priority, sprint_id, reporter_id, assigned_id)
      values (${dto.name}, ${dto.description}, ${TasksRepoImpl.dbPriorityParse(dto.priority)}, ${dto.sprintId}, ${dto.reporterId}, ${dto.assignedId})
      returning id`;

    if (!createdTaskId) {
      return err('Внутренняя ошибка при создании задачи');
    }

    const [row = null] = await postgres<(DbTask & { reporter: string; assigned: string })[]>`
      select
        t.id,
        t.name,
        t.description,
        t.status,
        t.priority,
        t.sprint_id,
        u_r.fio reporter,
        u_a.fio assigned
      from tasks t
      left join users u_r on u_r.id = t.reporter_id
      left join users u_a on u_a.id = t.assigned_id
      where t.id = ${createdTaskId}
      limit 1`;

    if (!row) {
      return err('Внутренняя ошибка при создании задачи');
    }

    const task = Task.new(
      row.id,
      row.name,
      row.description,
      TasksRepoImpl.statusParse(row.status),
      TasksRepoImpl.priorityParse(row.priority),
      row.reporter,
      row.assigned
    );

    if (!task) {
      return err('Ошибка приведения сущности DbTask к модели Task');
    }

    redisSet(`task:${task.id}`, REDIS_HOUR, task);
    redis.del(`tasks_by_sprint:${row.sprint_id}`);

    return ok(task);
  }

  /**
   * @inheritdoc
   * @see {TasksRepo.getTasksBySprintId}
   */
  async getTasksBySprintId(sprintId: string): Promise<Task[]> {
    const cacheKey = `tasks_by_sprint:${sprintId}`;
    const cachedTasks = await redisGet<Task[]>(cacheKey);

    if (cachedTasks !== undefined) {
      return cachedTasks?.map(Task.tryParse).removeNil() ?? [];
    }

    const rows = await postgres<(DbTask & { reporter: string; assigned: string })[]>`
      select
        t.id,
        t.name,
        t.description,
        t.status,
        t.priority,
        t.sprint_id,
        u_r.fio reporter,
        u_a.fio assigned
      from tasks t
      left join users u_r on u_r.id = t.reporter_id
      left join users u_a on u_a.id = t.assigned_id
      where t.sprint_id = ${sprintId}`;

    const tasks = rows
      .map((row) =>
        Task.new(
          row.id,
          row.name,
          row.description,
          TasksRepoImpl.statusParse(row.status),
          TasksRepoImpl.priorityParse(row.priority),
          row.reporter,
          row.assigned
        )
      )
      .removeNil();

    redisSet(cacheKey, REDIS_HOUR, tasks);

    return tasks;
  }

  /**
   * @inheritdoc
   * @see {TasksRepo.updateTaskStatus}
   */
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Res<Task, string>> {
    const [updated = null] = await postgres<Pick<DbTask, 'id' | 'sprint_id'>[]>`
      update tasks
      set status = ${TasksRepoImpl.dbStatusParse(status)}
      where id = ${taskId}
      returning id, sprint_id`;

    if (!updated) {
      return err('Задача не найдена');
    }

    const [row = null] = await postgres<(DbTask & { reporter: string; assigned: string })[]>`
      select
        t.id,
        t.name,
        t.description,
        t.status,
        t.priority,
        t.sprint_id,
        u_r.fio reporter,
        u_a.fio assigned
      from tasks t
      left join users u_r on u_r.id = t.reporter_id
      left join users u_a on u_a.id = t.assigned_id
      where t.id = ${updated.id}
      limit 1`;

    if (!row) {
      return err('Внутренняя ошибка при обновлении задачи');
    }

    const task = Task.new(
      row.id,
      row.name,
      row.description,
      TasksRepoImpl.statusParse(row.status),
      TasksRepoImpl.priorityParse(row.priority),
      row.reporter,
      row.assigned
    );

    if (!task) {
      return err('Ошибка приведения сущности DbTask к модели Task');
    }

    redisSet(`task:${task.id}`, REDIS_HOUR, task);
    redis.del(`tasks_by_sprint:${updated.sprint_id}`, `task:${taskId}`);

    return ok(task);
  }
}

/**
 * Регистрация в DI
 */
export const TASKS_REPO = diContainer.register<TasksRepo>(TasksRepoImpl.name, new TasksRepoImpl());
