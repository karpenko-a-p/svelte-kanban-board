<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    description: string;
    keywords?: string;
    robots?: string;
    children?: Snippet;
  }

  const { children, title, description, keywords = 'svelte,template', robots = 'index,follow' }: Props = $props();
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  <meta name="robots" content={robots} />
  {@render children?.()}
</svelte:head>
