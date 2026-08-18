<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string;
  }

  const { class: className = '', value, label, ...rest }: Props = $props();
</script>

<div class="view {className}" {...rest}>
  <p class="secondary">{label}</p>
  <div></div>
  <p>{value}</p>
</div>
