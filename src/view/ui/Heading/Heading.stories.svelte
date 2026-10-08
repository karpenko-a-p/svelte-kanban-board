<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Mock from '#project/.storybook/Mock.svelte';

  const { Story } = defineMeta({
    component: Mock,
    title: 'Heading'
  });
</script>

<Story name="Main">
  <h1>Heading</h1>
</Story>

<Story name="Variants">
  <h1>Heading h1</h1>
  <h2>Heading h2</h2>
  <h3>Heading h3</h3>
  <h4>Heading h4</h4>
  <h5>Heading h5</h5>
  <h6>Heading h6</h6>
</Story>
