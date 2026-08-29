<script lang="ts">
  import '@src/app.css';
  import Notifications from '@view/components/level-1/Notifications.svelte';
  import type { LayoutProps } from './$types';
  import { browser } from '$app/environment';

  const { children }: LayoutProps = $props();
</script>

<div class="w-full h-full flex">
  <div class="grow">
    {@render children()}
  </div>

  {#if browser}
    <Notifications />
  {/if}
</div>
