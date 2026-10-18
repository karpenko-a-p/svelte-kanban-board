<script lang="ts">
  import IconPlus from '@tabler/icons-svelte/icons/plus';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import Input from '#view/ui/Input/Input.svelte';
  import Modal from '#view/ui/Modal/Modal.svelte';
  import { createForm } from '#view/form-validators/form.svelte';
  import { input } from '#view/form-validators/input.svelte';
  import type { Res } from '#app/core/common';

  interface Props {
    opened: boolean;
    onsubmit(name: string, startedAt: string, finishedAt: string): Promise<Res<null, string[]>>;
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
      const creationResult = await onsubmit(
        form.fields.name.value,
        form.fields.startedAt.value,
        form.fields.finishedAt.value
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
  const { name, startedAt, finishedAt } = form.fields;

  // Очистка формы при размонтировании
  onMount(form.reset);
</script>

<Modal title="Создание нового спринта" bind:opened>
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
