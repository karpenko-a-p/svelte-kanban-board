<script lang="ts">
  import IconCheck from '@tabler/icons-svelte/icons/selector';
  import type { HTMLSelectAttributes } from 'svelte/elements';

  interface Props extends HTMLSelectAttributes {
    errorMessage?: string;
    invalid?: boolean;
    description?: string;
    label: string;
  }

  let {
    value = $bindable(),
    class: className = '',
    children,
    errorMessage,
    invalid,
    description,
    label,
    ...rest
  }: Props = $props();
</script>

<div class="select {className}">
  <label>
    <!-- Лэйбл -->
    <span>{label}</span>

    <!-- Селект -->
    <select {...rest} bind:value aria-invalid={invalid}>
      {@render children?.()}
    </select>

    <!-- Иконка заглушка -->
    <IconCheck />
  </label>

  <!-- Описание -->
  {#if description}
    <p class="select-description">{description}</p>
  {/if}

  <!-- Сообщение ошибки -->
  {#if invalid && errorMessage}
    <p class="select-error">{errorMessage}</p>
  {/if}
</div>
