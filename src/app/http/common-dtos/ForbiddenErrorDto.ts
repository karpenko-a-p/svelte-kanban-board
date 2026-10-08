import { FORBIDDEN_ERR } from '#app/http/constants/error-codes';
import { ErrorDto } from './ErrorDto';

/**
 * DTO ошибки если у пользователя недостаточно прав
 */
export class ForbiddenErrorDto extends ErrorDto {
  /**
   * Создание DTO
   * @param mesaage - сообщение ошибки
   */
  constructor(message = 'Недостаточно прав') {
    super(FORBIDDEN_ERR, message);
  }
  
  /**
   * Парсинг сущности к dto
   * @param dto - приводимая сущность
   */
  static tryParse(dto: unknown): Maybe<ForbiddenErrorDto> {
    if (ErrorDto.isExtends(dto) && dto.code === FORBIDDEN_ERR) {
      return new ForbiddenErrorDto(dto.message);
    }
  }
}
