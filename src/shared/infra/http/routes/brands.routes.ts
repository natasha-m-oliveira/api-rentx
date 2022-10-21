import { Router } from "express";

import { CreateBrandController } from "@modules/cars/useCases/createBrand/CreateBrandController";
import { ListBrandsController } from "@modules/cars/useCases/listBrands/ListBrandsController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const brandsRoutes = Router();

const createBrandController = new CreateBrandController();
const listBrandsController = new ListBrandsController();

brandsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createBrandController.handle
);

brandsRoutes.get("/", listBrandsController.handle);

export { brandsRoutes };
