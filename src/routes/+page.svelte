<script lang="ts">
  import { createUser } from '@app/use-cases/user/createUser';
  import type { PageProps } from '@svelte-kit/$types';
  import User from '@view/components/level-1/User.svelte';
  import { input } from '@view/form-validators/input.svelte';
  import Input from '@view/ui/Input/Input.svelte';

  const { data }: PageProps = $props();

  let name = input('', {
    minLength: [0, 'Must be greater or equal to 0'],
    maxLength: [5, 'Must be less or equal then 5']
  });
</script>

<h1>Hello World!</h1>

<div class="flex justify-between mx-2 mt-4">
  <button class="secondary" onclick={() => createUser('Alex')}>Create user</button>
</div>

<User />

<p class="mt-6 mb-2">Server user below</p>

{#if data.user}
  <p>{data.user.id}</p>
  <p>{data.user.name}</p>
  <p>{data.user.role}</p>
{/if}

<Input label="FIO" bind:value={name.value} errorMessage={name.error} invalid={name.invalid} />