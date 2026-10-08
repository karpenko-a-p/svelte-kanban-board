import { diContainer } from '#app/core/common';
import type { Sprint } from '#app/entities';
import { Store } from '#app/store/shared/Store.svelte';

/**
 * Стор для хранения спринтов
 */
export const SPRINTS_STORE = diContainer.register('SprintsStoreImpl', new Store<Sprint[]>([]));
