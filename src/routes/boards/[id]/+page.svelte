<script lang="ts">
  import IconBriefcase2 from '@tabler/icons-svelte/icons/briefcase-2';
  import IconCheck from '@tabler/icons-svelte/icons/check';
  import IconNotebook from '@tabler/icons-svelte/icons/notebook';
  import IconPlus from '@tabler/icons-svelte/icons/plus';
  import dayjs from 'dayjs';
  import { onDestroy, onMount } from 'svelte';
  import Track from '#view/components/kanban-board/Track.svelte';
  import CreateSprintModal from '#view/components/sprints/CreateSprintModal.svelte';
  import CreateTaskModal from '#view/components/taskts/CreateTaskModal.svelte';
  import { err, ok, type Res } from '#app/core/common';
  import { TaskStatus, type TaskPriority } from '#app/entities';
  import { BOARD_MEMBERS_STORE } from '#app/store/slices/boards';
  import { SPRINTS_STORE } from '#app/store/slices/sprints';
  import { TASKS_STORE } from '#app/store/slices/tasks';
  import { getBoardMembers } from '#app/use-cases/boards';
  import { createSprint, fetchSprints } from '#app/use-cases/sprints';
  import { createTask, fetchTasks, updateTaskStatus } from '#app/use-cases/tasks';
  import { browser } from '$app/env';
  import { page } from '$app/state';
  import type { PageProps } from '#svelte-kit/boards/[id]/$types';

  const sprintsStore = SPRINTS_STORE.get();
  const tasksStore = TASKS_STORE.get();
  const membersStore = BOARD_MEMBERS_STORE.get();

  const { data }: PageProps = $props();
  let sprintCreation = $state(false);
  let taskCreation = $state(false);
  let currentSprintId = $state('');
  const board = $derived(data.board);
  const user = $derived(page.data.user)!;

  // Сценарий создания новог спринта
  async function createSprintScenario(
    name: string,
    startedAt: string,
    finishedAt: string
  ): Promise<Res<null, string[]>> {
    // Создание нового спринта
    const createdSprint = await createSprint(
      name,
      new Date(startedAt).toISOString(),
      new Date(finishedAt).toISOString(),
      board.id
    );

    if (createdSprint.isOk()) {
      currentSprintId = createdSprint.unwrap().id;
      await fetchTasks(board.id, createdSprint.unwrap().id);
      return ok(null);
    }

    // Отображение ошибок
    return err(createdSprint.unwrapErr());
  }

  // Сценарий создания новой таски
  async function createTaskScenario(
    name: string,
    description: string,
    priority: TaskPriority,
    assignedId: string
  ): Promise<Res<null, string[]>> {
    // Создание новой задачи
    const createdTask = await createTask({
      name,
      description,
      priority,
      assignedId,
      reporterId: user.id,
      boardId: board.id,
      sprintId: currentSprintId
    });

    // задача создана
    if (createdTask.isOk()) {
      return ok(null);
    }

    // Отображение ошибок
    return err(createdTask.unwrapErr());
  }

  // Выбор спринта и запрос актуальных тасок
  function selectSprint(sprintId: string): void {
    currentSprintId = sprintId;
    fetchTasks(board.id, sprintId);
  }

  // Получение списка спринтов, задач, участников для открытой канбан доски
  onMount(async () => {
    const [lastCreatedSprint] = await Promise.all([fetchSprints(board.id), getBoardMembers(board.id)]);

    lastCreatedSprint.andThen((sprintId) => {
      currentSprintId = sprintId;
      fetchTasks(board.id, sprintId);
    });
  });

  // Очистка сторов при выходе
  onDestroy(() => {
    sprintsStore.clear();
    tasksStore.clear();
    membersStore.clear();
  });
</script>

<!-- eslint-disable @typescript-eslint/explicit-function-return-type -->

<section class="px-2 grow flex flex-col">
  <h1>{board?.name}</h1>
  <p class="secondary">{board?.description}</p>

  <main class="my-2 flex grow gap-4">
    <div class="flex flex-col basis-3xs">
      <button onclick={() => (sprintCreation = true)}>
        <IconPlus />
        Создать спринт
      </button>

      <!-- Список спринтов -->
      <div class="relative grow mt-2">
        <ul class="flex flex-col absolute top-0 left-0 h-full w-full overflow-y-auto">
          {#each sprintsStore.getSprints() as sprint (sprint.id)}
            <li class="rounded-2xl">
              <button
                onclick={() => selectSprint(sprint.id)}
                disabled={currentSprintId === sprint.id}
                class={[
                  'ghost w-full flex-col items-start text-start',
                  currentSprintId === sprint.id && 'border-2 border-solid border-blue-500'
                ]}
              >
                <div class="flex items-start text-wrap">
                  <p class="secondary mr-1 small">[{sprint.id}]</p>
                  <p class="small">{sprint.name}</p>
                </div>
                <p class="secondary small">Начало: {dayjs(sprint.startedAt).format('DD.MM.YYYY')}</p>
                <p class="secondary small">Конец: {dayjs(sprint.finishedAt).format('DD.MM.YYYY')}</p>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Канбан доска -->
    <section class="relative grow">
      {#if currentSprintId}
        <div class="absolute top-0 left-0 h-full w-full overflow-y-auto flex flex-col">
          <!-- хедер канбан доски -->
          <header class="flex items-center flex-nowrap mb-2 gap-2">
            <button onclick={() => (taskCreation = true)}>
              <IconPlus />
              Добавить задачу
            </button>
          </header>

          <!-- Список задач -->
          <main class="grid grid-cols-3 gap-2 grow">
            <!-- Ожидает -->
            <Track title="Ожидает" tasks={tasksStore.getByStatus(TaskStatus.NotStarted)}>
              {#snippet icon()}
                <IconNotebook />
              {/snippet}

              {#snippet button(taskId)}
                <button
                  class="small secondary py-1 text-xs"
                  onclick={() => updateTaskStatus(board.id, taskId, TaskStatus.InProgress)}
                >
                  В работу
                </button>
              {/snippet}
            </Track>

            <!-- В работе -->
            <Track title="В работе" tasks={tasksStore.getByStatus(TaskStatus.InProgress)}>
              {#snippet icon()}
                <IconBriefcase2 />
              {/snippet}

              {#snippet button(taskId)}
                <button
                  class="small secondary py-1 text-xs"
                  onclick={() => updateTaskStatus(board.id, taskId, TaskStatus.Done)}
                >
                  Выполнено
                </button>
              {/snippet}
            </Track>

            <!-- Выполнено -->
            <Track title="Выполнено" tasks={tasksStore.getByStatus(TaskStatus.Done)}>
              {#snippet icon()}
                <IconCheck />
              {/snippet}
            </Track>
          </main>
        </div>
      {:else}
        <div class="absolute top-0 left-0 h-full w-full flex items-center justify-center">
          <p class="secondary text-lg select-none">Создайте первый спринт!</p>
        </div>
      {/if}
    </section>
  </main>
</section>

<!-- Окно создания нового спринта  -->
{#if browser && sprintCreation}
  <CreateSprintModal onsubmit={createSprintScenario} bind:opened={sprintCreation} />
{/if}

<!-- Окно создания новой задачи  -->
{#if browser && taskCreation}
  <CreateTaskModal onsubmit={createTaskScenario} bind:opened={taskCreation} />
{/if}
