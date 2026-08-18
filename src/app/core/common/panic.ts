/**
 * Непредвиденная ошибка
 * @description Используется только в случаях, когда ситуация потенциально невозможна
 * @param message - сообщение об ошибке
 */
export function panic(message: string): never {
  throw new Error(`UNEXPECTED_ERROR: ${message}`);
}
