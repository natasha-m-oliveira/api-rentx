import { AppError } from "@shared/errors/AppError";

export class UploadCarImagesError extends AppError {
  constructor() {
    super("Car not found", 404);
  }
}
