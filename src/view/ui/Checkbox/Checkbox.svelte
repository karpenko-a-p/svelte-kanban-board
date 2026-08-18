<script lang="ts">
  import IconCheck from '@tabler/icons-svelte/icons/check';
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    errorMessage?: string;
    invalid?: boolean;
    disabled?: boolean;
  }

  let { checked = $bindable(), class: className = '', invalid, errorMessage, children, ...rest }: Props = $props();
</script>

<div class="checkbox {className}">
  <label>
    <input type="checkbox" bind:checked aria-invalid={invalid} {...rest} />

    <!-- Квадрат чекбокса -->
    <span class="checkbox-rect">
      <IconCheck class="checkbox-icon" />
    </span>

    <!-- Наименование -->
    {@render children?.()}
  </label>

  <!-- Текст ошибки -->
  {#if invalid && errorMessage}
    <p class="checkbox-error">{errorMessage}</p>
  {/if}
</div>