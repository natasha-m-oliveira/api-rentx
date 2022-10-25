import { NextFunction, Request, Response } from "express";
import { Joi, validate } from "express-validation";

export function createBrandValidation(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  return validate({
    body: Joi.object({
      name: Joi.string().required(),
    }),
  })(request, response, next);
}
