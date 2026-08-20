import { diContainer, isString } from '@app/core/common';
import { JWT_SECRET } from '@app/core/server';
import { SignJWT, jwtVerify } from 'jose';

/**
 * Сервис для работы с JWT токеном
 */
export interface TokenService {
  /**
   * Создание JWT токена
   * @param id - зашиваемый идентификатор пользователя
   * @returns JWT токен
   */
  sign(id: string): Promise<Maybe<string>>;

  /**
   * Подтверждение и чтение JWT токена
   * @param token - JWT токен
   * @returns данные токена (только идентификатор пользователя)
   */
  verify(token: string): Promise<Maybe<string>>;
}

/**
 * Ключ для подписи токена
 */
const ENCODED_JWT_SECRET = new TextEncoder().encode(JWT_SECRET);

/**
 * Алгоритм подписания токена
 */
const ALGORITHM = 'HS256';

/**
 * @implements {TokenService}
 */
class TokenServiceImpl implements TokenService {
  /**
   * @inheritDoc
   */
  sign(id: string): Promise<Maybe<string>> {
    return new SignJWT({ id })
      .setProtectedHeader({ alg: ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(ENCODED_JWT_SECRET)
      .catch(() => null);
  }

  /**
   * @inheritDoc
   */
  async verify(token: string): Promise<Maybe<string>> {
    try {
      const { payload } = await jwtVerify(token, ENCODED_JWT_SECRET, { algorithms: [ALGORITHM] });

      return isString(payload.id) ? payload.id : null;
    } catch {
      return null;
    }
  }
}

/**
 * Регистрация в DI
 */
export const TOKEN_SERVICE = diContainer.register<TokenService>(TokenServiceImpl.name, new TokenServiceImpl());
