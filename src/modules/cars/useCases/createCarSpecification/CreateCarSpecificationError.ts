import { AppError } from "@shared/errors/AppError";

export class CreateCarSpecificationError extends AppError {
  constructor() {
    super("Car not found", 404);
  }
}
