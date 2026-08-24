<script lang="ts">
  import { USER_HTTP_CLIENT } from '@app/http/clients/user';
  import { input } from '@view/form-validators/input.svelte';
  import Input from '@view/ui/Input/Input.svelte';

  import { goto } from '$app/navigation';

  const userHttpClient = USER_HTTP_CLIENT.get();
  let register = $state(true);
  let submitted = $state(false);

  const login = input('', {
    maxLength: [32, 'Максимальная длинна 32 символа'],
    minLength: [6, 'Минимальная длинна 6 символов']
  });

  const fio = input('', {
    maxLength: [64, 'Максимальная длинна 64 символа'],
    minLength: [5, 'Минимальная длинна 5 символов']
  });

  const password = input('', {
    maxLength: [128, 'Максимальная длинна 128 символа'],
    minLength: [6, 'Минимальная длинна 6 символов']
  });


  /**
   * Авторизация пользователя в системе
   * @description первичная регистрация или авторизация в зависимости от выбора пользователя
   */
  async function onsubmit(): Promise<void> {
    submitted = true;

    // Пользователь впервые регистрируется в системе
    if (register) {
      const auth = await userHttpClient.register(login.value, fio.value, password.value);

      if (auth.isOk()) {
        await goto('/boards', { invalidateAll: true });
      }

      return;
    }

    // Пользователь авторизуется в системе
    const auth = await userHttpClient.login(login.value, password.value);

    if (auth.isOk()) {
      await goto('/boards', { invalidateAll: true });
    }
  }
</script>

<div class="flex items-center justify-center h-screen w-full">
  <div class="flex flex-col rounded-2xl bg-blue-200 p-5 max-w-120 w-full">
    <h1 class="mb-2">Регистрация</h1>
    <p class="mb-6">Система доступна только для авторизованных пользователей</p>
    <form novalidate {onsubmit} id="auth-form" class="gap-4 flex flex-col">
      <Input
        label="Логин"
        bind:value={login.value}
        invalid={submitted && login.invalid}
        errorMessage={login.error}
        description="Введите логин от вашей учетной записи"
      />

      {#if register}
        <Input
          label="ФИО"
          bind:value={fio.value}
          invalid={submitted && fio.invalid}
          errorMessage={fio.error}
          description="Введите ваше ФИО через пробел"
        />
      {/if}

      <Input
        label="Пароль"
        bind:value={password.value}
        invalid={submitted && password.invalid}
        errorMessage={password.error}
        type="password"
        description="Введите пароль"
      />
    </form>

    <div class="mt-4 flex items-start justify-between">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <p class="link small" onclick={() => register = !register}>Уже есть учетная запись?</p>

      <button type="submit" class="small" form="auth-form">
        {register ? 'Зарегистрироваться' : 'Войти'}
      </button>
    </div>
  </div>
</div>

