<script lang="ts">
  import '#src/app.css';
  import IconKanban from '@tabler/icons-svelte/icons/layout-kanban-filled';
  import Notifications from '#view/components/notifications/Notifications.svelte';
  import NotificationsToggleButton from '#view/components/notifications/NotificationsToggleButton.svelte';
  import ProfileWidget from '#view/components/user/ProfileWidget.svelte';
  import { browser } from '$app/env';
  import type { LayoutProps } from './$types';

  const { children }: LayoutProps = $props();
</script>

<div class="w-full grow flex">
  <div class="grow flex flex-col">
    <header class="flex items-start justify-between p-2 relative">
      <!-- Главный заголовок -->
      <h1 class="flex items-center gap-2 font-black">
        <IconKanban size={36} class="fill-blue-500" />
        Дикий канбан
      </h1>

      <!-- Данные пользователя (вместо экрана) -->
      {#if browser}
        <ProfileWidget />
      {/if}

      <!-- Уведомления (кнопка переключения) -->
      {#if browser}
        <NotificationsToggleButton />
      {/if}
    </header>

    <main class="grow flex flex-col">
      {@render children()}
    </main>
  </div>

  <!-- Уведомления (список) -->
  {#if browser}
    <Notifications />
  {/if}
</div>
