/**
 * Хедеры для запроса
 */
export class ReqHeaders {
  /**
   * Создание набора хедеров
   * @param headers - набор хедеров
   */
  private constructor(private readonly headers: Headers) {}

  /**
   * Установка хедера
   * @param header - название
   * @param value - значение
   */
  set(header: string, value: string): ReqHeaders {
    this.headers.set(header, value);
    return this;
  }

  /**
   * Получение набора хедеров
   */
  build(): Headers {
    return this.headers;
  }

  /**
   * Создание стандартного набора хедеров
   */
  static default(): ReqHeaders {
    return new ReqHeaders(
      new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })
    );
  }

  /**
   * Создание пустого набора хедеров
   */
  static empty(): ReqHeaders {
    return new ReqHeaders(new Headers());
  }
}
