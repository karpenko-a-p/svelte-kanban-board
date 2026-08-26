<script lang="ts">
  import { RegisterUserExistsErr, LoginUserNotExistsErr, USER_HTTP_CLIENT } from '@app/http/clients/user';
  import { RegisterValidationErr } from '@app/http/common-errors';
  import { input } from '@view/form-validators/input.svelte';
  import Checkbox from '@view/ui/Checkbox/Checkbox.svelte';
  import Input from '@view/ui/Input/Input.svelte';
  import { slide } from 'svelte/transition';

  import { goto } from '$app/navigation';

  const userHttpClient = USER_HTTP_CLIENT.get();
  let register = $state(true);
  let submitted = $state(false);
  let agreed = $state(false);
  let validationErrors = $state<string[]>([]);

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
   * Переключение между регистрацией и авторизацией
   */
  function switchAuth(): void {
    register = !register;
    submitted = false;
  }

  /**
   * Авторизация пользователя в системе
   * @description первичная регистрация или авторизация в зависимости от выбора пользователя
   */
  async function onsubmit(): Promise<void> {
    if (register && !agreed) return;

    submitted = true;

    // Данные пользователя заполнены некорректно
    if (login.invalid || password.invalid || (register && fio.invalid)) {
      return;
    }

    // Пользователь впервые регистрируется в системе
    const auth = register
      ? await userHttpClient.register(login.value, fio.value, password.value)
      : await userHttpClient.login(login.value, password.value);

    // Отображение ошибки при наличии, иначе перевод на экран с досками
    auth
      .mapErr(err => {
        if (err instanceof RegisterValidationErr) return err.errors;
        if (err instanceof RegisterUserExistsErr) return ['Пользователь с таким логином уже существует'];
        if (err instanceof LoginUserNotExistsErr) return ['Неверные логин или пароль'];
        return ['Неизвестная ошибка авторизации'];
      })
      .andThen(() => goto('/boards', { invalidateAll: true }))
      .orElse(err => validationErrors = err);
  }
</script>

<div class="flex items-center justify-center h-screen w-full">
  <div class="flex flex-col max-w-120! w-full p-2">
    <h1 class="mb-2">Регистрация</h1>
    <p class="mb-6">Система доступна только для авторизованных пользователей</p>

    <!-- Фора с данными пользователя -->
    <form novalidate {onsubmit} id="auth-form" class="gap-4 flex flex-col">
      <Input
        label="Логин"
        placeholder="IvanovII"
        bind:value={login.value}
        invalid={submitted && login.invalid}
        errorMessage={login.error}
        description="Введите логин от вашей учетной записи"
      />

      {#if register}
        <Input
          label="ФИО"
          placeholder="Иванов Иван Иванович"
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

      {#if register}
        <Checkbox bind:checked={agreed}>
          <p class="self-start leading-5 small">
            Принять <a class="leading-5" href="/user-policy">пользовательское соглашение</a>
          </p>
        </Checkbox>
      {/if}
    </form>

    <!-- Ошибки валидации пришедшие с backend -->
    {#if validationErrors.length}
      <ul transition:slide class="rounded-xl border border-red-300 bg-red-200 flex flex-col gap-1 p-2 mt-4">
        {#each validationErrors as error}
          <li>
            <p class="small text-red-500">{error}</p>
          </li>
        {/each}
      </ul>
    {/if}

    <!-- Действия авторизации -->
    <div class="mt-4 flex items-start justify-between">
      <a class="small" href="#auth" onclick={switchAuth}>
        <p class="small text-inherit">
          {register ? 'Уже есть учетная запись?' : 'Зарегистрироваться'}
        </p>
      </a>

      <button type="submit" class="small" form="auth-form" disabled={register && !agreed}>
        {register ? 'Зарегистрироваться' : 'Войти'}
      </button>
    </div>
  </div>
</div>

