<script lang="ts">
  import IconPlus from '@tabler/icons-svelte/icons/plus';
  import IconTrash from '@tabler/icons-svelte/icons/trash';
  import { slide } from 'svelte/transition';
  import Input from '#view/ui/Input/Input.svelte';
  import Modal from '#view/ui/Modal/Modal.svelte';
  import { BOARD_MEMBERS_STORE } from '#app/store/slices/boards';
  import { createForm } from '#view/form-validators/form.svelte';
  import { input } from '#view/form-validators/input.svelte';
  import { page } from '$app/state';
  import type { Res } from '#app/core/common';

  const membersStore = BOARD_MEMBERS_STORE.get();
  const user = $derived(page.data.user)!;

  interface Props {
    opened: boolean;
    onsubmit(userId: string): Promise<Res<null, string[]>>;
    ondelete(userId: string): Promise<void>;
  }

  let { opened = $bindable(), onsubmit, ondelete }: Props = $props();
  let validationErrors: string[] = $state([]);

  // Форма создания спринта
  const form = createForm({
    fields: {
      userId: input('', {
        required: [true, 'Обязательно для заполнения'],
        matches: [/^\d+$/, 'Допустим ввод только цифр']
      })
    },
    async onsubmit(): Promise<void> {
      // Приглашение пользователя
      const creationResult = await onsubmit(form.fields.userId.value);

      // Отображение ошибок
      if (creationResult.isErr()) {
        validationErrors = creationResult.unwrapErr();
      }
    }
  });
</script>

<!-- eslint-disable @typescript-eslint/explicit-function-return-type -->

<Modal title="Участники доски" bind:opened>
  <form onsubmit={form.onsubmit} novalidate class="mt-4 flex flex-col">
    <section class="flex items-start gap-2 w-full">
      <Input
        label="ID пользователя"
        placeholder="100"
        bind:value={form.fields.userId.value}
        invalid={form.submitted && form.fields.userId.invalid}
        errorMessage={form.fields.userId.error}
        class="grow"
        description="Введите идентификатор пользователя для добавления его в доску"
      />

      <button class="h-12.5">
        <IconPlus />
        Добавить
      </button>
    </section>

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
  </form>

  <!-- Список участников канбан доски -->
  <ul class="flex flex-col gap-2 mt-4">
    {#each membersStore.getMembers() as member (member.id)}
      <li class="flex gap-2 items-center justify-between">
        <p>{member.fio}</p>

        {#if user.id !== member.id}
          <div class="flex items-center">
            <button class="small error" onclick={() => ondelete(member.id)}>
              <IconTrash />
              Удалить
            </button>
          </div>
        {:else}
          <p><strong>Вы</strong></p>
        {/if}
      </li>
    {/each}
  </ul>
</Modal>
