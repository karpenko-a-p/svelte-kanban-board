import { BAD_REQUEST_ERR } from '@app/http/constants/error-codes';
import { ErrorDto } from './ErrorDto';

/**
 * DTO ошибки при некорректном запросе клиента
 */
export class BadRequestErrorDto extends ErrorDto {
  /**
   * Создание DTO
   * @param mesaage - сообщение ошибки
   */
  constructor(message = 'Недостаточно прав') {
    super(BAD_REQUEST_ERR, message);
  }

  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<BadRequestErrorDto> {
    if (ErrorDto.isExtends(dto) && dto.code === BAD_REQUEST_ERR) {
      return new BadRequestErrorDto(dto.message);
    }
  }
}
