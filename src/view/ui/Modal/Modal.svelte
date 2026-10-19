<script module>
  // Остановка всплытия события
  function stopPropagation(e: MouseEvent): void {
    e.stopPropagation();
  }
</script>

<script lang="ts">
  import IconX from '@tabler/icons-svelte/icons/x';
  import { fade, scale } from 'svelte/transition';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    opened: boolean;
    title: string;
    children: Snippet;
  }

  let { opened = $bindable(false), title, children, ...props }: Props = $props();

  // Пользователь выделяет текст
  let selecting = $state(false);

  // Обработка нажатия "Esc"
  $effect(() => {
    const escapeHandle = (event: KeyboardEvent): void => void (event.key === 'Escape' && close());

    // Регистрация и очистка обработчика
    window.addEventListener('keydown', escapeHandle);
    return (): void => window.removeEventListener('keydown', escapeHandle);
  });

  // Закрытие модального окна
  function close(): void {
    if (!selecting) opened = false;
    selecting = false;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- eslint-disable @typescript-eslint/explicit-function-return-type -->

{#if opened}
  <div
    {...props}
    transition:fade|global
    class="fixed z-100 top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50"
    onmouseup={(e) => e.currentTarget === e.target && close()}
  >
    <!-- Белая подложка -->
    <section
      transition:scale|global
      class="paper w-150"
      onclick={stopPropagation}
      onmousedown={() => (selecting = true)}
      onmouseup={() => (selecting = false)}
    >
      <header class="flex items-center justify-between">
        <!-- Заголовок -->
        <h3 class="font-bold">{title}</h3>

        <!-- Закрытие -->
        <button class="ghost small p-1" onclick={close}>
          <IconX />
        </button>
      </header>

      <!-- Контент окна -->
      {@render children()}
    </section>
  </div>
{/if}
