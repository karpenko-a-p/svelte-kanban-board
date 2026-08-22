/**
 * Безопасный парсинг тела http запроса или ответа
 * @description защищает от попытки преобразования в json сущности не json формата
 * @param reqOrRes - http запрос или ответ
 * @returns json ответ, или null если приводимая сущность не является валидным json
 */
export function parseJson(reqOrRes: Request | Response): Promise<unknown> {
  return reqOrRes.json().catch(() => null);
}
