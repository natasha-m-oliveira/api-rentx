import { NextFunction, Request, Response } from "express";
import { Joi, validate } from "express-validation";

export function paramsIdValidation(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  validate({
    params: Joi.object({
      id: Joi.string().uuid().required().messages({
        "string.guid": `invalid "id"`,
      }),
    }),
  })(request, response, next);
}
