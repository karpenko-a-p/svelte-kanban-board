import { diContainer, err, ok, type Res } from '#app/core/common';
import { InvalidEntityErrorDto, ValidationErrorDto } from '#app/http/common-dtos';
import { BackErr, HttpErr } from '#app/http/common-errors';
import { ReqHeaders, request } from '#app/http/utils';
import { TaskDto } from './TaskDto';
import type { Task, TaskStatus } from '#app/entities';
import type { CreateTaskDto } from './CreateTaskDto';

/**
 * HTTP клиент для работы с api задач
 */
export interface TasksHttpClient {
  /**
   * Создание задачи
   * @param dto - данные для создания задачи
   * @returns новая таска или сообщение об ошибке
   */
  createTask(dto: CreateTaskDto): Promise<Res<Task, BackErr | HttpErr>>;

  /**
   * Получение задач по определённому спринту
   * @param sprintId - идентификатор спринта
   * @returns массив тасок
   */
  getTasksBySprintId(sprintId: string): Promise<Res<Task[], BackErr | HttpErr>>;

  /**
   * Обновление статуса задачи
   * @param taskId - идентификатор задачи
   * @param status - устанавливаемый статус
   * @returns обновленная таска или сообщение об ошибке
   */
  updateTaskStatus(taskId: string, status: TaskStatus): Promise<Res<Task, BackErr | HttpErr>>;
}

/**
 * @implements {TasksHttpClient}
 */
class TasksHttpClientImpl implements TasksHttpClient {
  /**
   * @inheritdoc
   * @see {TasksHttpClient.createTask}
   */
  async createTask(dto: CreateTaskDto): Promise<Res<Task, BackErr | HttpErr>> {
    const response = await request('/api/v1/tasks', {
      method: 'POST',
      headers: ReqHeaders.default().build(),
      body: JSON.stringify(dto)
    });

    // Ошибка сети
    if (response.isErr()) {
      return err(new HttpErr.Network());
    }

    const smartResponse = response.unwrap();

    // Задача создана
    if (smartResponse.isCreated) {
      const taskDto = TaskDto.tryParse(await smartResponse.json());

      if (taskDto) {
        return ok(taskDto.toTask());
      }
    }

    // Передано некорректное DTO
    else if (smartResponse.isUnprocessableEntity && InvalidEntityErrorDto.isExtends(await smartResponse.json())) {
      return err(new BackErr.InvalidEntity());
    }

    // Нет прав на создание задачи
    else if (smartResponse.isForbidden) {
      return err(new BackErr.Forbidden());
    }

    // Ошибка валидации
    else if (smartResponse.isBadRequest) {
      const responseBody = await smartResponse.json();

      if (ValidationErrorDto.isExtends(responseBody)) {
        return err(new BackErr.Validation(responseBody.issues));
      }
    }

    // Неизвестная ошибка
    return err(new BackErr.Server());
  }

  /**
   * @inheritdoc
   * @see {TasksHttpClient.getTasksBySprintId}
   */
  async getTasksBySprintId(sprintId: string): Promise<Res<Task[], BackErr | HttpErr>> {
    const response = await request(`/api/v1/tasks?sprint-id=${sprintId}`, {
      method: 'GET',
      headers: ReqHeaders.default().build()
    });

    // Ошибка сети
    if (response.isErr()) {
      return err(new HttpErr.Network());
    }

    const smartResponse = response.unwrap();

    // Данные задач получены
    if (smartResponse.isOk) {
      const responseBody = await smartResponse.json();

      // Бэк вернул некорректный ответ
      if (!responseBody || !Array.isArray(responseBody)) {
        return err(new BackErr.Server());
      }

      return ok(
        responseBody
          .map(TaskDto.tryParse)
          .removeNil()
          .map((dto) => dto.toTask())
      );
    }

    // Неизвестная ошибка
    return err(new BackErr.Server());
  }

  /**
   * @inheritdoc
   * @see {TasksHttpClient.updateTaskStatus}
   */
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Res<Task, BackErr | HttpErr>> {
    const response = await request(`/api/v1/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: ReqHeaders.default().build(),
      body: JSON.stringify({ status })
    });

    // Ошибка сети
    if (response.isErr()) {
      return err(new HttpErr.Network());
    }

    const smartResponse = response.unwrap();

    // Статус обновлён
    if (smartResponse.isOk) {
      const taskDto = TaskDto.tryParse(await smartResponse.json());

      if (taskDto) {
        return ok(taskDto.toTask());
      }
    }

    // Передано некорректное DTO
    else if (smartResponse.isUnprocessableEntity && InvalidEntityErrorDto.isExtends(await smartResponse.json())) {
      return err(new BackErr.InvalidEntity());
    }

    // Нет прав на обновление задачи
    else if (smartResponse.isForbidden) {
      return err(new BackErr.Forbidden());
    }

    // Задача не найдена
    else if (smartResponse.isNotFound) {
      return err(new BackErr.NotFound());
    }

    // Ошибка валидации
    else if (smartResponse.isBadRequest) {
      const responseBody = await smartResponse.json();

      if (ValidationErrorDto.isExtends(responseBody)) {
        return err(new BackErr.Validation(responseBody.issues));
      }
    }

    // Неизвестная ошибка
    return err(new BackErr.Server());
  }
}

/**
 * Регистрация в DI
 */
export const TASKS_HTTP_CLIENT = diContainer.register(TasksHttpClientImpl.name, new TasksHttpClientImpl());
