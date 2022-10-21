/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/errors/AppError";

export namespace CreateCarError {
  export class CarAlreadyExists extends AppError {
    constructor() {
      super("Car already exists");
    }
  }

  export class CategoryNotFound extends AppError {
    constructor() {
      super("Category not found", 404);
    }
  }

  export class BrandNotFound extends AppError {
    constructor() {
      super("Brand not found", 404);
    }
  }
}
