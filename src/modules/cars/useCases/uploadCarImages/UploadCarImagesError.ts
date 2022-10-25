/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/errors/AppError";

export namespace UploadCarImagesError {
  export class CarNotFound extends AppError {
    constructor() {
      super("Car not found", 404);
    }
  }

  export class InvalidFileFormat extends AppError {
    constructor() {
      super("Invalid file format, images only.");
    }
  }
}
