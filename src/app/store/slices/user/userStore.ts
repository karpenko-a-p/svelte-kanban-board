import { diContainer } from '@app/core/common';
import type { User } from '@app/entities';
import { Store } from '@app/store/shared/Store.svelte';

/**
 * Cтор для хранения данных пользователя
 */
export const USER_STORE = diContainer.register('UserStoreImpl', new Store<Maybe<User>>(null));
