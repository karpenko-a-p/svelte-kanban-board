<script lang="ts">
  import { User } from '@app/entities';
  import { logout } from '@app/use-cases/user';
  import IconLogout from '@tabler/icons-svelte/icons/logout';
  import IconUser from '@tabler/icons-svelte/icons/user';
  import { toggle } from '@view/wrappers';
  import dayjs from 'dayjs';
  import { slide } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  const user = $derived(User.tryParse(page.data.plainUser));
  const full = toggle(false);

  /**
   * Выход из аккаунта
   * @description выыполенение сценария выхода из аккаунта и перевод пользователя на экран авторизации
   */
  async function logoutUser(): Promise<void> {
    const res = await logout();

    if (res.isOk()) {
      full.falsy();
      await goto('/', { invalidateAll: true });
    }
  }
</script>

{#snippet param(name: string, value: string)}
  <li class="flex justify-between items-baseline">
    <p class="small secondary">{name}</p>
    <span class="grow border-b border-black/20 border-dotted min-w-4 mx-1.5"></span>
    <p class="small font-bold">{value}</p>
  </li>
{/snippet}

{#if user}
  <section class="bg-gray-200 p-1 rounded-2xl cursor-pointer flex flex-col absolute top-2 left-1/2 -translate-x-1/2">
    <!-- ФИО -->
    <button class="secondary small rounded-xl group" onclick={full.toggle}>
      <IconUser size={20} class="group-hover:stroke-blue-500 transition" />
      {user.fio}
    </button>

    {#if full.val}
      <div transition:slide class="flex flex-col px-4 my-2">
        <!-- Параметры пользователя -->
        <ul class="flex flex-col gap-1">
          {@render param('ID', user.id)}
          {@render param('Логин', user.login)}
          {@render param('Зарегистрирован', dayjs(user.createdAt).format('DD.MM.YYYY'))}
        </ul>

        <!-- Выход из аккаунта -->
        <button class="small warn mt-4" onclick={logoutUser}>
          <IconLogout />
          Выйти из аккаунта
        </button>
      </div>
    {/if}
  </section>
{/if}
