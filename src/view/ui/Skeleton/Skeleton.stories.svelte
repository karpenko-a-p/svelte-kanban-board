<script module>
  import Mock from '@project/.storybook/Mock.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    component: Mock,
    title: 'Skeleton'
  });
</script>

<Story name="Main">
  <Mock>
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <div class="skeleton" />
  </Mock>
</Story>

<Story name="Some skeletons">
  <Mock>
    <div class="flex flex-col gap-2">
      <div class="skeleton"></div>
      <div class="skeleton"></div>
      <div class="skeleton"></div>
    </div>
  </Mock>
</Story>

<Story name="Rounded">
  <Mock>
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <div class="rounded-full skeleton w-10 h-10" />
  </Mock>
</Story>
