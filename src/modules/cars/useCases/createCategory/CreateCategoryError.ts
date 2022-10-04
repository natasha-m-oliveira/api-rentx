import { AppError } from "@shared/errors/AppError";

export class CreateCategoryError extends AppError {
  constructor() {
    super("Category already exists");
  }
}
