<script lang="ts">
  import { Board, Sprint } from '@app/entities';
  import type { PageProps } from '@svelte-kit/boards/[id]/$types';
  import IconPlus from '@tabler/icons-svelte/icons/plus';

  const { data }: PageProps = $props();

  const board = $derived(Board.tryParse(data.plainBoard));
  const sprints = $derived(data.plainSprints.map(Sprint.tryParse).removeNil());
</script>

<section class="px-2 grow flex flex-col">
  <h1>{board?.name}</h1>
  <p class="secondary">{board?.description}</p>

  <main class="mt-2 flex grow gap-4">
    <div class="flex flex-col basis-3xs">
      <button>
        <IconPlus />
        Создать спринт
      </button>

      <ul class="flex flex-col gap-2">
        {#each sprints as sprint (sprint.id)}
          <li>
            {sprint.name}
          </li>
        {/each}
      </ul>
    </div>

    <div>Kanban</div>
  </main>
</section>
