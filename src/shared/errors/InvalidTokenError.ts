import { AppError } from "./AppError";

export class InvalidTokenError extends AppError {
  constructor() {
    super("Invalid token", 401);
  }
}
