<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import FileInput from './FileInput.svelte';

  const { Story } = defineMeta({
    component: FileInput,
    title: 'FileInput'
  });
</script>

<Story name="Main" />

<Story name="Children">
  <p>I am child</p>
</Story>

<Story name="Description" args={{ description: 'Some description' }}>
  <p>I am child</p>
</Story>

<Story name="Disabled" args={{ disabled: true }}>
  <p>I am child</p>
</Story>

<Story name="Error" args={{ invalid: true, errorMessage: 'Error' }}>
  <p>I am child</p>
</Story>

<Story name="Disabled and error" args={{ disabled: true, invalid: true, errorMessage: 'Error' }}>
  <p>I am child</p>
</Story>

<Story name="Texts" args={{ description: 'Description', invalid: true, errorMessage: 'Error' }}>
  <p>I am child</p>
</Story>
