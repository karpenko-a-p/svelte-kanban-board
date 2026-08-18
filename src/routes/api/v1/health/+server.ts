import { OK } from '@app/http/constants';
import { json, type RequestHandler } from '@sveltejs/kit';

/**
 * Проверка жизнеспособности сервера
 */
export const GET: RequestHandler = () => json(null, { status: OK });
