import type { User } from '@app/entities';
import { Store } from '@app/store/shared/Store.svelte';

/**
 * стор для хранения данных пользователя
 */
export const userStore = new Store<Maybe<User>>(null);
