import { SERVER_ERROR } from '@app/http/constants';

import { ErrorDto } from './ErrorDto';

/**
 * DTO внутренней ошибки сервера
 */
export class ServerErrorDto extends ErrorDto {
  /**
   * Создание DTO
   * @param message - сообщение об ошибке
   */
  constructor(message = 'Внутренняя ошибка сервера') {
    super(SERVER_ERROR, message);
  }

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<ServerErrorDto> {
    if (ErrorDto.isExtends(dto) && dto.code === SERVER_ERROR) {
      return new ServerErrorDto(dto.message);
    }
  }
}
