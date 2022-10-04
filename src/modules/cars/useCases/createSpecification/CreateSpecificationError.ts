import { AppError } from "@shared/errors/AppError";

export class CreateSpecificationError extends AppError {
  constructor() {
    super("Specification already exists");
  }
}
