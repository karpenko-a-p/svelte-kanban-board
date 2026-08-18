<script lang="ts">
  import IconFile from '@tabler/icons-svelte/icons/file';
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    invalid?: boolean;
    errorMessage?: string;
    description?: string;
  }

  let {
    files = $bindable(),
    children,
    class: className = '',
    invalid,
    errorMessage,
    description,
    ...rest
  }: Props = $props();
</script>

<div class="file-input {className}">
  <label>
    <input type="file" aria-invalid={invalid} bind:files {...rest} />
    {@render children?.()}
    <p class="file-input-placeholder"><IconFile />Приложите файлы</p>
  </label>

  {#if description}
    <p class="file-input-description">{description}</p>
  {/if}

  {#if invalid && errorMessage}
    <p class="file-input-error">{errorMessage}</p>
  {/if}
</div>
