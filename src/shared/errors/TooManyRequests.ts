import { AppError } from "./AppError";

export class TooManyRequests extends AppError {
  constructor() {
    super("Too many requests", 429);
  }
}
