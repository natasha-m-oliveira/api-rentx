import { NextFunction, Request, Response } from "express";
import { Joi, validate } from "express-validation";

export function createSpecificationValidation(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  return validate({
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
    }),
  })(request, response, next);
}
