<script lang="ts">
  import IconKanban from '@tabler/icons-svelte/icons/layout-kanban-filled';
  import IconPlus from '@tabler/icons-svelte/icons/plus';
  import Input from '#view/ui/Input/Input.svelte';
  import Modal from '#view/ui/Modal/Modal.svelte';
  import { createBoard } from '#app/use-cases/boards';
  import { input } from '#view/form-validators/input.svelte';
  import { browser } from '$app/env';
  import { refreshAll } from '$app/navigation';
  import type { PageProps } from '#svelte-kit/boards/$types';

  const { data }: PageProps = $props();

  let creation = $state(false);
  let submitted = $state(false);
  const boards = $derived(data.boards);

  const name = input('', {
    required: [true, 'Обязательно для заполнения'],
    maxLength: [64, 'Максимальная длинна 64 символа'],
    minLength: [6, 'Минимальная длинна 6 символов']
  });

  const description = input('', {
    required: [true, 'Обязательно для заполнения']
  });

  // Открытие модального окна с созданием новой доски
  function openCreation(): void {
    creation = true;
    submitted = false;
    name.value = '';
    description.value = '';
  }

  /**
   * Создание новой канбан доски
   * @description Валидация данных с формы и запуск сценария создания новой доски
   */
  async function onsubmit(): Promise<void> {
    submitted = true;

    if (name.invalid || description.invalid) {
      return;
    }

    await createBoard(name.value, description.value);
    refreshAll();
  }
</script>

<div class="container grow flex flex-col">
  {#if boards.length}
    <h2 class="my-2">Список досок</h2>
    <ul class="grid grid-cols-4 gap-2">
      {#each boards as board (board.id)}
        <li>
          <a
            href="/boards/{board.id}"
            class="rounded-xl border-2 border-gray-300 p-2 w-full no-underline hover:border-blue-500"
          >
            <div class="flex items-center gap-2">
              <IconKanban size={28} class="fill-blue-500" />
              <p class="badge small">ID {board.id}</p>
              <p class="font-bold text-lg">{board.name}</p>
            </div>
            <p class="secondary small">{board.description.slice(0, 100)}</p>
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="flex flex-col grow items-center justify-center">
      <h4 class="mb-2">Вы не состоите ни в одной из досок</h4>
      <p class="secondary max-w-100 text-center mb-4">
        Для работы с канбан досками вам необходимо иметь хотя бы одну свою доскку или нужно быть подключенным к доскам
        какого-либо проекта
      </p>

      <button onclick={openCreation}>
        <IconPlus />
        Создать
      </button>
    </div>
  {/if}

  <!-- Окно создания новой канбан доски  -->
  {#if browser && creation}
    <Modal title="Создание новой канбан доски" bind:opened={creation}>
      <form {onsubmit} novalidate class="flex flex-col gap-4 mt-4">
        <Input
          label="Название"
          placeholder="Проект Бюджетирование"
          bind:value={name.value}
          invalid={submitted && name.invalid}
          errorMessage={name.error}
          description="Введите название новой канбан доски"
        />

        <Input
          label="Описание"
          placeholder="Учет бюджета огранизации"
          bind:value={description.value}
          invalid={submitted && description.invalid}
          errorMessage={description.error}
          description="Введите описание новой канбан доски"
        />

        <!-- Создание новой доски -->
        <button class="mt-4" type="submit">
          <IconPlus />
          Создать
        </button>
      </form>
    </Modal>
  {/if}
</div>
