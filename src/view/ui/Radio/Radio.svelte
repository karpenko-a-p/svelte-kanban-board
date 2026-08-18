<script lang="ts">
  import IconCheck from '@tabler/icons-svelte/icons/check';
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    errorMessage?: string;
    invalid?: boolean;
    disabled?: boolean;
  }

  let {
    class: className = '',
    group = $bindable(),
    children,
    invalid,
    errorMessage,
    ...restProps
  }: Props = $props();
</script>

<div class="radio {className}">
  <label>
    <!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
    <input type="radio" bind:group aria-invalid={invalid} {...restProps} />

    <!-- Кружок -->
    <span class="radio-circle">
      <IconCheck class="radio-icon" />
    </span>

    <!-- Наименование -->
    {@render children?.()}
  </label>

  <!-- Текст ошибки -->
  {#if invalid && errorMessage}
    <p class="radio-error">{errorMessage}</p>
  {/if}
</div>
