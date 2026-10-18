<script lang="ts">
  import IconPlus from '@tabler/icons-svelte/icons/plus';
  import dayjs from 'dayjs';
  import { onMount } from 'svelte';
  import Track from '#view/components/kanban-board/Track.svelte';
  import CreateSprintModal from '#view/components/sprints/CreateSprintModal.svelte';
  import { err, ok, type Res } from '#app/core/common';
  import { SPRINTS_STORE } from '#app/store/slices/sprints';
  import { createSprint, fetchSprints } from '#app/use-cases/sprints';
  import { fetchTasks } from '#app/use-cases/tasks';
  import { browser } from '$app/env';
  import type { PageProps } from '#svelte-kit/boards/[id]/$types';

  const sprintsStore = SPRINTS_STORE.get();

  const { data }: PageProps = $props();
  let creation = $state(false);
  let currentSprintId = $state('');
  const board = $derived(data.board);

  // Сценарий создания новог спринта
  async function onsubmit(name: string, startedAt: string, finishedAt: string): Promise<Res<null, string[]>> {
    // Создание нового спринта
    const createdSprint = await createSprint(
      name,
      new Date(startedAt).toISOString(),
      new Date(finishedAt).toISOString(),
      board.id
    );

    if (createdSprint.isOk()) {
      await fetchTasks(board.id, createdSprint.unwrap().id);
      return ok(null);
    }

    // Отображение ошибок
    return err(createdSprint.unwrapErr());
  }

  // Выбор спринта и запрос актуальных тасок
  function selectSprint(sprintId: string): void {
    currentSprintId = sprintId;
    fetchTasks(board.id, sprintId);
  }

  // Получение списка спринтов и задач для открытой канбан доски
  onMount(async () => {
    const lastCreatedSprint = await fetchSprints(board.id);
    lastCreatedSprint.andThen((sprintId) => fetchTasks(board.id, sprintId));
  });
</script>

<!-- eslint-disable @typescript-eslint/explicit-function-return-type -->

<section class="px-2 grow flex flex-col">
  <h1>{board?.name}</h1>
  <p class="secondary">{board?.description}</p>

  <main class="my-2 flex grow gap-4">
    <div class="flex flex-col basis-3xs">
      <button onclick={() => (creation = true)}>
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
      <div class="grid grid-cols-3 absolute top-0 left-0 h-full w-full overflow-y-auto gap-2">
        <Track title="Ожидает" tasks={[]} />
        <Track title="В работе" tasks={[]} />
        <Track title="Выполнено" tasks={[]} />
      </div>
    </section>
  </main>
</section>

<!-- Окно создания нового спринта  -->
{#if browser && creation}
  <CreateSprintModal {onsubmit} bind:opened={creation} />
{/if}
