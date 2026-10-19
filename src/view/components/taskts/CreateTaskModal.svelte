<script lang="ts">
  import IconPlus from '@tabler/icons-svelte/icons/plus';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import Input from '#view/ui/Input/Input.svelte';
  import Modal from '#view/ui/Modal/Modal.svelte';
  import Select from '#view/ui/Select/Select.svelte';
  import { TaskPriority } from '#app/entities/';
  import { BOARD_MEMBERS_STORE } from '#app/store/slices/boards';
  import { createForm } from '#view/form-validators/form.svelte';
  import { input } from '#view/form-validators/input.svelte';
  import type { Res } from '#app/core/common';

  const membersStore = BOARD_MEMBERS_STORE.get();

  interface Props {
    opened: boolean;
    onsubmit(
      name: string,
      description: string,
      priority: TaskPriority,
      assignedId: string
    ): Promise<Res<null, string[]>>;
  }

  let { opened = $bindable(), onsubmit }: Props = $props();
  let validationErrors: string[] = $state([]);

  // Форма создания спринта
  const form = createForm({
    fields: {
      name: input('', {
        required: [true, 'Обязательно для заполнения'],
        maxLength: [64, 'Максимальная длинна 64 символа']
      }),
      description: input('', {}),
      priority: input('', {
        required: [true, 'Обязательно для заполнения']
      }),
      assignedId: input('', {
        required: [true, 'Обязательно для заполнения']
      })
    },
    async onsubmit(): Promise<void> {
      // Создание нового спринта
      const creationResult = await onsubmit(
        form.fields.name.value,
        form.fields.description.value,
        form.fields.priority.value as TaskPriority,
        form.fields.assignedId.value
      );

      // Закрытие модельного окна после успешного выполнения действия
      if (creationResult.isOk()) {
        opened = false;
        return;
      }

      // Отображение ошибок
      validationErrors = creationResult.unwrapErr();
    }
  });

  // Поля формы
  const { name, description, priority, assignedId } = form.fields;

  // Очистка формы при размонтировании
  onMount(form.reset);
</script>

<Modal title="Создание новой задачи" bind:opened>
  <form onsubmit={form.onsubmit} novalidate class="flex flex-col gap-4 mt-4">
    <Input
      label="Название"
      placeholder="Решение проблемы бюджетирования"
      bind:value={name.value}
      invalid={form.submitted && name.invalid}
      errorMessage={name.error}
      description="Введите название задачи"
    />

    <Input
      label="Описание"
      placeholder="Необходимо исправить расчет"
      bind:value={description.value}
      invalid={form.submitted && description.invalid}
      errorMessage={description.error}
      description="Не обязательно*"
    />

    <Select
      label="Приоритет"
      placeholder="Выберите приоритет"
      bind:value={priority.value}
      invalid={form.submitted && priority.invalid}
      errorMessage={priority.error}
      description="Выберите приоритет задачи"
    >
      <option value={TaskPriority.Low}>Низкий</option>
      <option value={TaskPriority.Medium} selected>Средний</option>
      <option value={TaskPriority.High}>Высокий</option>
    </Select>

    <Select
      label="Исполнитель"
      placeholder="Выберите исполнителя"
      bind:value={assignedId.value}
      invalid={form.submitted && assignedId.invalid}
      errorMessage={assignedId.error}
      description="Выберите исполнителя задачи"
    >
      {#each membersStore.getMembers() as member (member.id)}
        <option value={member.id}>{member.fio}</option>
      {/each}
    </Select>

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
