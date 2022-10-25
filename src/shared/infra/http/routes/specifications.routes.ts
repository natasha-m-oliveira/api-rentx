import { Router } from "express";

import { CreateSpecificationController } from "@modules/cars/useCases/createSpecification/CreateSpecificationController";
import { ListSpecificationsController } from "@modules/cars/useCases/listSpecifications/ListSpecificationsController";
import { ensureAdmin } from "@shared/infra/http/middlewares/ensureAdmin";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

import { createSpecificationValidation } from "../middlewares/validations/createSpecificationValidation";

const specificationsRoutes = Router();

const createSpecificationController = new CreateSpecificationController();
const listSpecificationsController = new ListSpecificationsController();

specificationsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createSpecificationValidation,
  createSpecificationController.handle
);

specificationsRoutes.get("/", listSpecificationsController.handle);

export { specificationsRoutes };
