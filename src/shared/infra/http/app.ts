import "reflect-metadata";

import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import "../../container";

import upload from "@config/upload";
import { errorHandler } from "@shared/infra/http/middlewares/errorHandler";
import { router } from "@shared/infra/http/routes";

import swaggerFile from "../../../swagger.json";
import createConnection from "../typeorm";

void createConnection();

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// expondo arquivos estáticos
app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));

app.use(router);

app.use(errorHandler);

export { app };
