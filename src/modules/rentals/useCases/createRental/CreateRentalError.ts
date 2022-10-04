/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/errors/AppError";

export namespace CreateRentalError {
  export class CarNotFound extends AppError {
    constructor() {
      super("Car not found", 404);
    }
  }

  export class CarIsUnavailable extends AppError {
    constructor() {
      super("Car is unavailable");
    }
  }

  export class RentalInProgress extends AppError {
    constructor() {
      super("There's a rental in progress for user");
    }
  }

  export class InvalidReturnTime extends AppError {
    constructor() {
      super("Invalid return time");
    }
  }
}
