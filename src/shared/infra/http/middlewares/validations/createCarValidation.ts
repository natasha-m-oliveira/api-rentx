import { NextFunction, Request, Response } from "express";
import { Joi, validate } from "express-validation";

export function createCarValidation(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  return validate({
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      daily_rate: Joi.number().positive().required(),
      license_plate: Joi.string().regex(/[a-zA-Z]{3}-?[0-9]{4}/),
      fine_amount: Joi.number().positive().required(),
      brand_id: Joi.string().uuid().required().messages({
        "string.guid": `invalid "brand_id"`,
      }),
      category_id: Joi.string().uuid().required().messages({
        "string.guid": `invalid "category_id"`,
      }),
    }),
  })(request, response, next);
}
