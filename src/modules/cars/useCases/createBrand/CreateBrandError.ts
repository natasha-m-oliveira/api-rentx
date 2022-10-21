import { AppError } from "@shared/errors/AppError";

export class CreateBrandError extends AppError {
  constructor() {
    super("Brand already exists");
  }
}
