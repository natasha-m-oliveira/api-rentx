import { Router } from "express";

import { AuthenticateUserController } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshTokenController";

import { sessionValidation } from "../middlewares/validations/sessionValidation";

const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenUserController = new RefreshTokenController();

authenticateRoutes.post(
  "/sessions",
  sessionValidation,
  authenticateUserController.handle
);
authenticateRoutes.post("/refresh-token", refreshTokenUserController.handle);

export { authenticateRoutes };
