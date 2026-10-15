<script lang="ts">
  import IconPlus from '@tabler/icons-svelte/icons/plus';
  import dayjs from 'dayjs';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import Input from '#view/ui/Input/Input.svelte';
  import Modal from '#view/ui/Modal/Modal.svelte';
  import { SPRINTS_STORE } from '#app/store/slices/sprints';
  import { createSprint, fetchSprints } from '#app/use-cases/sprints';
  import { createForm } from '#view/form-validators/form.svelte';
  import { input } from '#view/form-validators/input.svelte';
  import { browser } from '$app/env';
  import type { PageProps } from '#svelte-kit/boards/[id]/$types';

  const sprintsStore = SPRINTS_STORE.get();

  const { data }: PageProps = $props();
  let creation = $state(false);
  let validationErrors: string[] = $state([]);
  const board = $derived(data.board);

  // Форма создания спринта
  const form = createForm({
    fields: {
      name: input('', {
        required: [true, 'Обязательно для заполнения'],
        maxLength: [64, 'Максимальная длинна 64 символа']
      }),
      startedAt: input('', {
        required: [true, 'Обязательно для заполнения'],
        matches: [/^\d{4}\/\d{2}\/\d{2}$/, 'Формат даты ГГГГ/ММ/ДД']
      }),
      finishedAt: input('', {
        required: [true, 'Обязательно для заполнения'],
        matches: [/^\d{4}\/\d{2}\/\d{2}$/, 'Формат даты ГГГГ/ММ/ДД']
      })
    },
    async onsubmit(): Promise<void> {
      // Создание нового спринта
      const createdSprint = await createSprint(
        form.fields.name.value,
        new Date(form.fields.startedAt.value).toISOString(),
        new Date(form.fields.finishedAt.value).toISOString(),
        board.id
      );

      if (createdSprint.isOk()) {
        creation = false;
        // TODO load kanban
        return;
      }

      // Отображение ошибок
      validationErrors = createdSprint.unwrapErr();
    }
  });

  // Поля формы
  const { name, startedAt, finishedAt } = form.fields;

  // Открытие модального окна с созданием спринта
  function openCreation(): void {
    creation = true;
    form.reset();
  }

  // Получение списка спринтов для открытой канбан доски
  onMount(() => fetchSprints(board.id));
</script>

<section class="px-2 grow flex flex-col">
  <h1>{board?.name}</h1>
  <p class="secondary">{board?.description}</p>

  <main class="mt-2 flex grow gap-4">
    <div class="flex flex-col basis-3xs">
      <button onclick={openCreation}>
        <IconPlus />
        Создать спринт
      </button>

      <ul class="flex flex-col">
        {#each sprintsStore.getSprints() as sprint (sprint.id)}
          <li class="rounded-2xl mt-2">
            <button class="ghost w-full flex-col gap-0 items-start text-start">
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

    <div>Kanban</div>
  </main>
</section>

<!-- Окно создания нового спринта  -->
{#if browser && creation}
  <Modal title="Создание нового спринта" bind:opened={creation}>
    <form onsubmit={form.onsubmit} novalidate class="flex flex-col gap-4 mt-4">
      <Input
        label="Название"
        placeholder="Спринт №1"
        bind:value={name.value}
        invalid={form.submitted && name.invalid}
        errorMessage={name.error}
        description="Введите название спринта"
      />

      <Input
        label="Дата начала спринта"
        placeholder="ГГГГ/ММ/ДД"
        bind:value={startedAt.value}
        invalid={form.submitted && startedAt.invalid}
        errorMessage={startedAt.error}
        description="Введите дату начала спринта"
      />

      <Input
        label="Дата окончания спринта"
        placeholder="ГГГГ/ММ/ДД"
        bind:value={finishedAt.value}
        invalid={form.submitted && finishedAt.invalid}
        errorMessage={finishedAt.error}
        description="Введите дату окончания спринта"
      />

      <!-- Ошибки валидации пришедшие с backend -->
      {#if validationErrors.length}
        <ul transition:slide class="rounded-xl border border-red-300 bg-red-200 flex flex-col gap-1 p-2 mt-4">
          {#each validationErrors as error}
            <li>
              <p class="small text-red-600">{error}</p>
            </li>
          {/each}
        </ul>
      {/if}

      <!-- Создание новой доски -->
      <button class="mt-4" type="submit">
        <IconPlus />
        Создать
      </button>
    </form>
  </Modal>
{/if}
