<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Mock from '#project/.storybook/Mock.svelte';

  const { Story } = defineMeta({
    component: Mock,
    title: 'Text'
  });
</script>

<Story name="Main">
  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam, necessitatibus?</p>
</Story>

<Story name="Secondary">
  <p class="secondary">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, totam?</p>
</Story>

<Story name="Strong">
  <p>Lorem <strong>ipsum dolor sit amet consectetur</strong> adipisicing elit. Sapiente, totam?</p>
</Story>
