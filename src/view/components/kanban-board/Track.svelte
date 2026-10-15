<script lang="ts">
  import type { Task } from '#app/entities';

  interface Props {
    title: string;
    tasks: Task[];
  }

  const { title, tasks }: Props = $props();
</script>

<section class="flex flex-col bg-gray-100 rounded-md">
  <h4 class="m-2">{title}</h4>

  <ul>
    {#each tasks as task (task.id)}
      <li>{task.id}</li>
    {/each}
  </ul>
</section>
