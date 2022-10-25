import { NextFunction, Request, Response } from "express";
import { Joi, validate } from "express-validation";

export function sessionValidation(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  return validate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    }),
  })(request, response, next);
}
