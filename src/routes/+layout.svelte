<script lang="ts">
  import '@src/app.css';
  import type { LayoutProps } from './$types';

  const { children }: LayoutProps = $props();
</script>

{@render children()}
