import type { HandleServerError, ServerInit } from '@sveltejs/kit';

/**
 * Запуск приложения
 */
export const init: ServerInit = () => {
  console.log('ServerInit');
};

/**
 * Обработка серверной ошибки
 */
export const handleError: HandleServerError = ({ error, event }) => {
  console.warn(`
    Непредвиденная ошибка сервера
    #1 Сообщение: ${error}
    #2 Метод: ${event.request.method}
    #3 URL: ${event.request.url}
    #4 Адресс: ${event.getClientAddress()}
    #5 Куки ${JSON.stringify(event.cookies.getAll())}
    #6 Хедеры ${JSON.stringify(event.request.headers.entries())}`);
};
