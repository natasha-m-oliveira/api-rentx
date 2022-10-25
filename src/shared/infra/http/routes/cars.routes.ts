import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { CreateCarSpecificationController } from "@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController";
import { GetCarByIdController } from "@modules/cars/useCases/getCarById/GetCarByIdController";
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController";
import { UploadCarImagesController } from "@modules/cars/useCases/uploadCarImages/UploadCarImagesController";
import { ensureAdmin } from "@shared/infra/http/middlewares/ensureAdmin";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

import { createCarSpecificationsValidation } from "../middlewares/validations/createCarSpecificationsValidation";
import { createCarValidation } from "../middlewares/validations/createCarValidation";
import { paramsIdValidation } from "../middlewares/validations/paramsIdValidation";

const carsRoutes = Router();

const upload = multer(uploadConfig);

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImagesController();
const getCarByIdCarController = new GetCarByIdController();

carsRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  createCarValidation,
  createCarController.handle
);

carsRoutes.post(
  "/:id/images",
  ensureAuthenticated,
  ensureAdmin,
  paramsIdValidation,
  upload.array("images"),
  uploadCarImagesController.handle
);

carsRoutes.post(
  "/:id/specifications",
  ensureAuthenticated,
  ensureAdmin,
  paramsIdValidation,
  createCarSpecificationsValidation,
  createCarSpecificationController.handle
);

carsRoutes.get("/available", listAvailableCarsController.handle);

carsRoutes.get("/:id", paramsIdValidation, getCarByIdCarController.handle);

export { carsRoutes };
