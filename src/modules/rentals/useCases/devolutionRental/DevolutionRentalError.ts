import { AppError } from "@shared/errors/AppError";

export class DevolutionRentalError extends AppError {
  constructor() {
    super("Rental not found", 404);
  }
}
