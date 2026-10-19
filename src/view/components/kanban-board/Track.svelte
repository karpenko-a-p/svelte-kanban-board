<script lang="ts">
  import type { Task } from '#app/entities';
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    icon: Snippet;
    tasks: Task[];
  }

  const { title, tasks, icon }: Props = $props();
</script>

<section class="flex flex-col bg-gray-100 rounded-md">
  <div class="flex items-center m-2">
    {@render icon?.()}
    <h4 class="ml-2">{title}</h4>
  </div>

  <ul class="border-t-3 border-t-white">
    {#each tasks as task (task.id)}
      <li>{task.id}</li>
    {:else}
      <p class="secondary small w-full text-center p-2">Нет задач</p>
    {/each}
  </ul>
</section>
