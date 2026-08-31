<script module lang="ts">
  import { NOTIFICATION_STORE, NotificationType } from '@app/store/slices/notification';
  import IconX from '@tabler/icons-svelte/icons/x';
  import { slide } from 'svelte/transition';

  const notificationStore = NOTIFICATION_STORE.get();

  // Стили для разных видов уведомлений
  const classes: Record<NotificationType, string> = {
    [NotificationType.Success]: 'bg-green-200 border-green-300 *:text-green-800',
    [NotificationType.Neutral]: 'bg-white border-gray-300',
    [NotificationType.Warning]: 'bg-orange-200 border-orange-300 *:text-orange-700',
    [NotificationType.Bad]: 'bg-red-200 border-red-300 *:text-red-600'
  };
</script>

{#if notificationStore.notificationsVisible()}
  <div transition:slide={{ axis: 'x' }} class="h-screen w-100 bg-gray-100 p-2 overflow-y-hidden flex flex-col">
    <h3 class="my-3 font-bold">Уведомления</h3>
    <ul class="flex flex-col">
      {#each notificationStore.getNotifications() as notification (notification.id)}
        <li transition:slide class="border p-2 rounded-lg w-[384px] not-first:mt-2 {classes[notification.type]}">
          <button
            class="ghost small float-right p-1 ml-2"
            onclick={(): void => notificationStore.deleteNotification(notification.id)}
          >
            <IconX />
          </button>

          <p class="text-justify">{notification.message}</p>
        </li>
      {/each}
    </ul>
  </div>
{/if}
