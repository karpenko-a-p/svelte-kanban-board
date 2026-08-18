<script lang="ts">
  import { userStore } from '@app/store/userStore';

  const user = $derived(userStore.get());
</script>

<p>Client user below</p>

{#if user}
  <p>{user.id}</p>
  <p>{user.login}</p>
  <p>{user.fio}</p>
{/if}
