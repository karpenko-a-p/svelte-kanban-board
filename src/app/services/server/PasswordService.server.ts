import { diContainer } from '@app/core/common';
import { password } from 'bun';

/**
 * Сервис для работы с паролями
 */
export interface PasswordService {
  /**
   * Хэширование пароля
   * @param pass - изначальный пароль
   */
  hashPassword(pass: string): Promise<string>;

  /**
   * Подтверждение пароля
   * @param pass - пароль пользователя
   * @param hashedPass - хэшированный пароль пользователя
   */
  verifyPassword(pass: string, hashedPass: string): Promise<boolean>;
}

const ALGORITHM = 'argon2id';

/**
 * @implements {PasswordService}
 */
class PasswordServiceImpl implements PasswordService {
  /**
   * @inheritDoc
   */
  hashPassword(pass: string): Promise<string> {
    return password.hash(pass, ALGORITHM);
  }

  /**
   * @inheritDoc
   */
  verifyPassword(pass: string, hashedPass: string): Promise<boolean> {
    return password.verify(pass, hashedPass, ALGORITHM);
  }
}

const PASSWORD_SERVICE = diContainer.token('PASSWORD_SERVICE');

diContainer.set(PASSWORD_SERVICE, new PasswordServiceImpl());
