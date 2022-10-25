import { Router } from "express";

import { CreateRentalController } from "@modules/rentals/useCases/createRental/CreateRentalController";
import { DevolutionRentalController } from "@modules/rentals/useCases/devolutionRental/DevolutionRentalController";
import { ListRentalsByUserController } from "@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { createRentalValidation } from "../middlewares/validations/createRentalValidation";
import { paramsIdValidation } from "../middlewares/validations/paramsIdValidation";

const rentalsRoutes = Router();

const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUserController = new ListRentalsByUserController();

rentalsRoutes.post(
  "/",
  ensureAuthenticated,
  createRentalValidation,
  createRentalController.handle
);
rentalsRoutes.post(
  "/:id/devolution",
  ensureAuthenticated,
  paramsIdValidation,
  devolutionRentalController.handle
);
rentalsRoutes.get(
  "/user",
  ensureAuthenticated,
  listRentalsByUserController.handle
);

export { rentalsRoutes };
