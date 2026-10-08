<script lang="ts">
  import IconPlus from '@tabler/icons-svelte/icons/plus';
  import { onMount } from 'svelte';
  import Input from '#view/ui/Input/Input.svelte';
  import Modal from '#view/ui/Modal/Modal.svelte';
  import { SPRINTS_STORE } from '#app/store/slices/sprints';
  import { input } from '#view/form-validators/input.svelte';
  import { browser } from '$app/env';
  import type { PageProps } from '#svelte-kit/boards/[id]/$types';

  const { data }: PageProps = $props();

  // Сторы
  const sprintsStore = SPRINTS_STORE.get();

  let creation = $state(false);
  let submitted = $state(false);
  const board = $derived(data.board);

  const name = input('', {
    required: [true, 'Обязательно для заполнения'],
    maxLength: [64, 'Максимальная длинна 64 символа']
  });

  const startedAt = input('', {
    required: [true, 'Обязательно для заполнения'],
    matches: [/\d{2}.\d{2}.\d{4}/, 'Формат даты ДД.ММ.ГГГГ']
  });

  const finishedAt = input('', {
    required: [true, 'Обязательно для заполнения'],
    matches: [/\d{2}.\d{2}.\d{4}/, 'Формат даты ДД.ММ.ГГГГ']
  });

  async function onsubmit(): Promise<void> {
    submitted = true;
  }

  // Открытие модального окна с созданием спринта
  function openCreation(): void {
    creation = true;
    submitted = false;
    name.value = '';
    startedAt.value = '';
    finishedAt.value = '';
  }

  // Получение списка спринтов
  onMount(() => console.log('will be soon'));
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

      <ul class="flex flex-col gap-2">
        {#each sprintsStore.get() as sprint (sprint.id)}
          <li class="p-2 rounded-2xl">
            {sprint.name}
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
    <form {onsubmit} novalidate class="flex flex-col gap-4 mt-4">
      <Input
        label="Название"
        placeholder="Спринт №1"
        bind:value={name.value}
        invalid={submitted && name.invalid}
        errorMessage={name.error}
        description="Введите название спринта"
      />

      <Input
        label="Дата начала спринта"
        placeholder="ДД.ММ.ГГГГ"
        bind:value={startedAt.value}
        invalid={submitted && startedAt.invalid}
        errorMessage={startedAt.error}
        description="Введите дату начала спринта"
      />

      <Input
        label="Дата окончания спринта"
        placeholder="ДД.ММ.ГГГГ"
        bind:value={finishedAt.value}
        invalid={submitted && finishedAt.invalid}
        errorMessage={finishedAt.error}
        description="Введите дату окончания спринта"
      />

      <!-- Создание новой доски -->
      <button class="mt-4" type="submit">
        <IconPlus />
        Создать
      </button>
    </form>
  </Modal>
{/if}
