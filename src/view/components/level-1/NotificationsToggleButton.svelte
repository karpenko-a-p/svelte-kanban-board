<script module lang="ts">
  import { NOTIFICATION_STORE } from '@app/store/slices/notification';
  import IconMessageFilled from '@tabler/icons-svelte/icons/message-filled';

  // Сторы
  const notificationStore = NOTIFICATION_STORE.get();

  /**
   * Переключение видимости панели с уведомлениями
   */
  function toggleNotificationsVisibility(): void {
    notificationStore.notificationsVisible()
      ? notificationStore.closeNotiffications()
      : notificationStore.openNotiffications();
  }
</script>

<button class="secondary small" onclick={toggleNotificationsVisibility}>
  <IconMessageFilled />
  Уведомления
</button>
