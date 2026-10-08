import { OK } from '#app/http/constants';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Проверка жизнеспособности сервера
 */
export const GET: RequestHandler = () => Response.json(null, { status: OK });
