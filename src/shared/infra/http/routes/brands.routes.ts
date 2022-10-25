import { Router } from "express";

import { CreateBrandController } from "@modules/cars/useCases/createBrand/CreateBrandController";
import { ListBrandsController } from "@modules/cars/useCases/listBrands/ListBrandsController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { createBrandValidation } from "../middlewares/validations/createBrandValidation";

const brandsRoutes = Router();

const createBrandController = new CreateBrandController();
const listBrandsController = new ListBrandsController();

brandsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createBrandValidation,
  createBrandController.handle
);

brandsRoutes.get("/", listBrandsController.handle);

export { brandsRoutes };
