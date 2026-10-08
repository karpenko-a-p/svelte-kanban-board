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

  // Обработка нажатия "Esc"
  $effect(() => {
    const escapeHandle = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        close();
      }
    };

    // Регистрация и очистка обработчика
    window.addEventListener('keydown', escapeHandle);
    return (): void => window.removeEventListener('keydown', escapeHandle);
  });

  // Закрытие модального окна
  function close(): void {
    opened = false;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->

{#if opened}
  <div
    {...props}
    transition:fade|global
    class="fixed z-100 top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50"
    onclick={close}
  >
    <!-- Белая подложка -->
    <section transition:scale|global class="paper w-150" onclick={stopPropagation}>
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
