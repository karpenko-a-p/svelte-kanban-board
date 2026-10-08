<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Mock from '#project/.storybook/Mock.svelte';

  const { Story } = defineMeta({
    component: Mock,
    title: 'Paper'
  });
</script>

<Story name="Main">
  <div class="paper">Paper content</div>
</Story>
