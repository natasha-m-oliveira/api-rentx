import { NextFunction, Request, Response } from "express";
import { Joi, validate } from "express-validation";

export function forgotPasswordValidation(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  return validate({
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  })(request, response, next);
}
