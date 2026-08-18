<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import View from './View.svelte';

  const { Story } = defineMeta({
    component: View,
    title: 'View'
  });
</script>

<Story name="Main" args="{{ label: 'label', value: 'value' }}" />

<Story name="Many">
  {#snippet template()}
    <div class="flex flex-col gap-1">
      <View label="Label" value="Value" />
      <View label="Label" value="Value" />
      <View label="Label" value="Value" />
    </div>
  {/snippet}
</Story>

