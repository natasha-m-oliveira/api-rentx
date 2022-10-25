import { NextFunction, Request, Response } from "express";
import { Joi, validate } from "express-validation";

export function createRentalValidation(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  return validate({
    body: Joi.object({
      expected_return_date: Joi.date().iso().required(),
      car_id: Joi.string().uuid().required(),
    }),
  })(request, response, next);
}
