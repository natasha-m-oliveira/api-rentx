import { NextFunction, Request, Response } from "express";
import { Joi, validate } from "express-validation";

export function createCarSpecificationsValidation(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  return validate({
    body: Joi.object({
      specifications_id: Joi.array()
        .items(
          Joi.string().uuid().messages({
            "string.guid": `invalid "specification_id"`,
          })
        )
        .required(),
    }),
  })(request, response, next);
}
