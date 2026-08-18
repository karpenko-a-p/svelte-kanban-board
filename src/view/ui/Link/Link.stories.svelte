<script module>
  import Mock from '@project/.storybook/Mock.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    component: Mock,
    title: 'Link'
  });
</script>

<Story name="Main">
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#">Link</a>
</Story>

<Story name="Text as link">
  <p class="link">Text as link</p>
</Story>

<Story name="Link wraps button">
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#">
    <button>Go to page</button>
  </a>
</Story>