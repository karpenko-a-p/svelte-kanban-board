<script module>
  import Mock from '@project/.storybook/Mock.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import IconCheck from '@tabler/icons-svelte/icons/check';

  const { Story } = defineMeta({
    component: Mock,
    title: 'Button'
  });
</script>

<Story name="Primary">
  <Mock>
    <button>Button</button>
  </Mock>
</Story>

<Story name="Variants">
  <Mock>
    <div class="flex items-center gap-3">
      <button>Button</button>
      <button class="secondary">Button</button>
      <button class="ghost">Button</button>
      <button class="warn">Button</button>
      <button class="error">Button</button>
    </div>
  </Mock>
</Story>

<Story name="Sizes">
  <Mock>
    <div class="flex gap-4 items-center">
      <button class="small">Button</button>
      <button>Button</button>
      <button class="big">Button</button>
    </div>
    <div class="flex gap-4 items-center mt-5">
      <button class="secondary small">Button</button>
      <button class="secondary">Button</button>
      <button class="secondary big">Button</button>
    </div>
    <div class="flex gap-4 items-center mt-5">
      <button class="ghost small">Button</button>
      <button class="ghost">Button</button>
      <button class="ghost big">Button</button>
    </div>
    <div class="flex gap-4 items-center mt-5">
      <button class="warn small">Button</button>
      <button class="warn">Button</button>
      <button class="warn big">Button</button>
    </div>
    <div class="flex gap-4 items-center mt-5">
      <button class="error small">Button</button>
      <button class="error">Button</button>
      <button class="error big">Button</button>
    </div>
  </Mock>
</Story>

<Story name="Icons">
  <Mock>
    <div class="flex gap-4 items-center">
      <button class="small"><IconCheck />Button<IconCheck /></button>
      <button><IconCheck />Button<IconCheck /></button>
      <button class="big"><IconCheck />Button<IconCheck /></button>
    </div>
    <div class="flex gap-4 items-center mt-5">
      <button class="secondary small"><IconCheck />Button<IconCheck /></button>
      <button class="secondary"><IconCheck />Button<IconCheck /></button>
      <button class="secondary big"><IconCheck />Button<IconCheck /></button>
    </div>
    <div class="flex gap-4 items-center mt-5">
      <button class="ghost small"><IconCheck />Button<IconCheck /></button>
      <button class="ghost"><IconCheck />Button<IconCheck /></button>
      <button class="ghost big"><IconCheck />Button<IconCheck /></button>
    </div>
    <div class="flex gap-4 items-center mt-5">
      <button class="warn small"><IconCheck />Button<IconCheck /></button>
      <button class="warn"><IconCheck />Button<IconCheck /></button>
      <button class="warn big"><IconCheck />Button<IconCheck /></button>
    </div>
    <div class="flex gap-4 items-center mt-5">
      <button class="error small"><IconCheck />Button<IconCheck /></button>
      <button class="error"><IconCheck />Button<IconCheck /></button>
      <button class="error big"><IconCheck />Button<IconCheck /></button>
    </div>
  </Mock>
</Story>

<Story name="Disabled">
  <Mock>
    <button disabled><IconCheck />Button</button>
    <button class="secondary" disabled><IconCheck />Button</button>
    <button class="ghost" disabled><IconCheck />Button</button>
    <button class="warn" disabled><IconCheck />Button</button>
    <button class="error" disabled><IconCheck />Button</button>
  </Mock>
</Story>
