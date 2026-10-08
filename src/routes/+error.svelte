<script>
  import { page } from '$app/state';
  const message = $derived(page.error?.message || 'Страница не найдена');
</script>

<h1 class="w-screen h-screen! flex items-center justify-center">{message}</h1>
