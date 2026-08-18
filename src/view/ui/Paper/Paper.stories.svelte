<script module>
  import Mock from '@project/.storybook/Mock.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    component: Mock,
    title: 'Paper'
  });
</script>

<Story name="Main">
  <div class="paper">Paper content</div>
</Story>
