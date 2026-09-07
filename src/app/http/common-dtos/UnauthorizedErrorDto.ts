import { UNAUTHORIZED_ERR } from '@app/http/constants/error-codes';
import { ErrorDto } from './ErrorDto';

/**
 * DTO ошибки для неавторизованного пользователя
 */
export class UnauthorizedErrorDto extends ErrorDto {
  /**
   * Создание DTO
   * @param mesaage - сообщение ошибки
   */
  constructor(message = 'Пользователь не авторизоваан') {
    super(UNAUTHORIZED_ERR, message);
  }
  
  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<UnauthorizedErrorDto> {
    if (ErrorDto.isExtends(dto) && dto.code === UNAUTHORIZED_ERR) {
      return new UnauthorizedErrorDto(dto.message);
    }
  }
}
