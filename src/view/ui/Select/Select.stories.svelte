<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Select from './Select.svelte';

  const { Story } = defineMeta({
    component: Select,
    title: 'Select'
  });
</script>

<Story name="Main" args={{ label: 'Label' }}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</Story>

<Story name="Description" args={{ label: 'Label', description: 'Description' }}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</Story>

<Story name="Error" args={{ label: 'Label', invalid: true, errorMessage: 'Error' }}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</Story>

<Story name="Disabled" args={{ label: 'Label', disabled: true }}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</Story>

<Story name="Disabled and error" args={{ label: 'Label', invalid: true, errorMessage: 'Error', disabled: true }}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</Story>
