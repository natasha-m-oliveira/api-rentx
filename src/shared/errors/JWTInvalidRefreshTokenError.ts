import { AppError } from "./AppError";

export class JWTInvalidRefreshTokenError extends AppError {
  constructor() {
    super("JWT invalid refresh token!", 401);
  }
}
