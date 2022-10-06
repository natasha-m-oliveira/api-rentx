import { AppError } from "./AppError";

export class TokenMissingError extends AppError {
  constructor() {
    super("Token is missing!", 401);
  }
}
