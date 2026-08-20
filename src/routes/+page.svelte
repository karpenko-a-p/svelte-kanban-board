<script lang="ts">
  import type { PageProps } from '@svelte-kit/$types';

  const { data }: PageProps = $props();
</script>

<h1>Hello World!</h1>

<p>{data.error.code}</p>