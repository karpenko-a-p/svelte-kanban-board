<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Radio from './Radio.svelte';

  const { Story } = defineMeta({
    component: Radio,
    title: 'Radio'
  });
</script>

<Story name="Main">Lorem ipsum dolor sit.</Story>

<Story name="Error" args={{ invalid: true, errorMessage: 'Error' }}>Lorem ipsum dolor sit.</Story>

<Story name="Disabled" args={{ disabled: true }}>Lorem ipsum dolor sit.</Story>

<Story name="Disabled and error" args={{ disabled: true, invalid: true, errorMessage: 'Error' }}>
  Lorem ipsum dolor sit.
</Story>

<Story name="Mixed">
  {#snippet template()}
    <div class="flex flex-col gap-3">
      <Radio value="Value 1" name="test">Value 1</Radio>
      <Radio value="Value 2" name="test" disabled>Value 2</Radio>
      <Radio value="Value 3" name="test" invalid errorMessage="Error message">Value 3</Radio>
      <Radio value="Value 4" name="test">
        <p class="text-sm">Value <strong>4</strong></p>
      </Radio>
    </div>
  {/snippet}
</Story>
