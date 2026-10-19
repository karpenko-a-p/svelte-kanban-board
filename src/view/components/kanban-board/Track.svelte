<script lang="ts">
  import IconSquareArrowDownFilled from '@tabler/icons-svelte/icons/square-arrow-down-filled';
  import IconSquareDotFilled from '@tabler/icons-svelte/icons/square-dot-filled';
  import { TaskPriority, type Task } from '#app/entities';
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    icon: Snippet;
    tasks: Task[];
    button?: Snippet<[string]>;
  }

  const { title, tasks, icon, button }: Props = $props();
</script>

<!-- eslint-disable @typescript-eslint/explicit-function-return-type -->

<section class="flex flex-col bg-gray-100 rounded-md">
  <div class="flex items-center m-2">
    {@render icon?.()}
    <h4 class="ml-2">{title}</h4>
  </div>

  <ul class="border-t-3 border-t-white p-1 flex flex-col gap-1">
    {#each tasks as task (task.id)}
      <li class="bg-white p-2 rounded-md shadow-black flex flex-col gap-1.5">
        <!-- Параметы ззадачи -->
        <p class="small secondary">[ {task.id} ] {task.assigned}</p>
        <p class="font-bold">{task.name}</p>

        {#if task.description}
          <p class="small">
            {task.description.length > 128 ? `${task.description.slice(0, 128)}...` : task.description}
          </p>
        {/if}

        <div class="flex items-center justify-between">
          <!-- Приоритет -->
          <div class="flex items-center flex-nowrap gap-1">
            {#if task.priority === TaskPriority.Low}
              <IconSquareArrowDownFilled class="text-green-500 size-5" />
              <p class="small">Низкий приоритет</p>
            {:else if task.priority === TaskPriority.Medium}
              <IconSquareDotFilled class="text-blue-500 size-5" />
              <p class="small">Средний приоритет</p>
            {:else if task.priority === TaskPriority.High}
              <IconSquareArrowDownFilled class="text-red-500 size-5 rotate-180" />
              <p class="small">Высокий приоритет</p>
            {/if}
          </div>

          <!-- Действие -->
          {@render button?.(task.id)}
        </div>
      </li>
    {:else}
      <p class="secondary small w-full text-center p-2">Нет задач</p>
    {/each}
  </ul>
</section>
