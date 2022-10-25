import { AppError } from "@shared/errors/AppError";

export class UpdateUserAvatarError extends AppError {
  constructor() {
    super("Invalid file format, images only.");
  }
}
