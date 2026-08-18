/**
 * Проверка сущности на запись
 * @param val - проверяемое значение
 */
export const isRecord = (val: unknown): val is Record<string, unknown> => !!val && typeof val === 'object';

/**
 * Проверка сущности на массив
 * @param val - проверяемое значение
 */
export const isArray = (val: unknown): val is unknown[] => Array.isArray(val);

/**
 * Проверка сущности на строку
 * @param val - проверяемое значение
 */
export const isString = (val: unknown): val is string => typeof val === 'string';

/**
 * Проверка сущности на число
 * @param val - проверяемое значение
 */
export const isNumber = (val: unknown): val is number => typeof val === 'number';

/**
 * Проверка сущности на целое число
 * @param val - проверяемое значение
 */
export const isInteger = (val: unknown): val is number => typeof val === 'number' && Number.isInteger(val);

/**
 * Проверка сущности на булево значение
 * @param val - проверяемое значение
 */
export const isBool = (val: unknown): val is boolean => typeof val === 'boolean';

/**
 * Проверка даты
 * @param val - проверяемое значение
 */
export const isDate = (val: unknown): val is Date => val instanceof Date && !Number.isNaN(val.getTime());
