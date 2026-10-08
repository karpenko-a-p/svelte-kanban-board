<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import IconCheck from '@tabler/icons-svelte/icons/check';
  import Mock from '#project/.storybook/Mock.svelte';

  const { Story } = defineMeta({
    component: Mock,
    title: 'Badge'
  });
</script>

<Story name="Main">
  <p class="badge">Badge</p>
</Story>

<Story name="Styles">
  <div class="flex gap-4">
    <p class="badge">Badge</p>
    <p class="badge green">Badge</p>
    <p class="badge blue">Badge</p>
  </div>
</Story>

<Story name="Icons">
  <div class="flex gap-4">
    <p class="badge"><IconCheck />Badge<IconCheck /></p>
    <p class="badge green"><IconCheck />Badge<IconCheck /></p>
    <p class="badge blue"><IconCheck />Badge<IconCheck /></p>
  </div>
</Story>
