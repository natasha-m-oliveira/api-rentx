import { AppError } from "./AppError";

export class TokenExpiredError extends AppError {
  constructor() {
    super("Token Expired", 401);
  }
}
