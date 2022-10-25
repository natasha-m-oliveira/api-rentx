import { Router } from "express";

import { ResetUserPasswordController } from "@modules/accounts/useCases/resetUserPassword/ResetUserPasswordController";
import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController";

import { forgotPasswordValidation } from "../middlewares/validations/forgotPasswordValidation";
import { resetUserPasswordValidation } from "../middlewares/validations/resetUserPassword";

const passwordRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetUserPasswordController = new ResetUserPasswordController();

passwordRoutes.post(
  "/forgot",
  forgotPasswordValidation,
  sendForgotPasswordMailController.handle
);
passwordRoutes.post(
  "/reset",
  resetUserPasswordValidation,
  resetUserPasswordController.handle
);

export { passwordRoutes };
