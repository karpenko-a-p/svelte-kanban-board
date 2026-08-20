import { ErrorDto } from '@app/http/common-dtos';
import type { PageServerLoad } from '@svelte-kit/$types';

export const load: PageServerLoad = () => {
  const error = ErrorDto.new('ERR_CODE', 'err message')?.toPojo();

  return { error };
};
