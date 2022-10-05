import { AppError } from "@shared/errors/AppError";

export class CreateCarError extends AppError {
  constructor() {
    super("Car already exists");
  }
}
