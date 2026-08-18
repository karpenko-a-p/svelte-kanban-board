<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Input from './Input.svelte';

  const { Story } = defineMeta({
    component: Input,
    title: 'Input',

  });
</script>

<Story name="Main" args={{ label: 'Label', placeholder: 'Placeholder' }} />

<Story name="Description" args={{ label: 'Label', placeholder: 'Placeholder', description: 'Description' }} />

<Story name="Error" args={{ label: 'Label', placeholder: 'Placeholder', invalid: true, errorMessage: 'Error' }} />

<Story name="Disabled" args={{ label: 'Label', placeholder: 'Placeholder', disabled: true }} />

<Story name="DisabledAndText" args={{ label: 'Label', placeholder: 'Placeholder', disabled: true, value: 'Some' }} />

<Story
  name="Disabled and error"
  args={{ label: 'Label', placeholder: 'Placeholder', invalid: true, errorMessage: 'Error', disabled: true }}
/>
