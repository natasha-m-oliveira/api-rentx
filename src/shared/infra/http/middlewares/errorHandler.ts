import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";

import { AppError } from "@shared/errors/AppError";

export function errorHandler(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
): Response {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    });
  } else if (err instanceof ValidationError) {
    return response.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
  }

  return response.status(500).json({
    status: "error",
    message: `Internal server error - ${err.message}`,
  });
}
