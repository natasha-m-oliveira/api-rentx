import { AppError } from "@shared/errors/AppError";

export class ImportCategoryError extends AppError {
  constructor() {
    super("Invalid file format, CSV only.");
  }
}
