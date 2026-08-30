declare global {
  interface Array<T> {
    /**
     * Удаление из массива всех элементов равных null или undefined
     * @returns новый массив очищенный от null и undefined
     */
    removeNil(): NotNil<T>[];
  }
}

/**
 * @inheritdoc
 */
Array.prototype.removeNil = function <T>(): NotNil<T>[] {
  const res: NotNil<T>[] = [];

  for (let i = 0; i < this.length - 1; i++) {
    if (this[i] !== null && this[i] !== undefined) {
      res.push(this[i]);
    }
  }

  return res;
};

export {};
