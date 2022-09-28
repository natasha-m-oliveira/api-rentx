import "reflect-metadata";

import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import "../../container";

import { errorHandler } from "@shared/infra/http/middlewares/errorHandler";
import { router } from "@shared/infra/http/routes";

import swaggerFile from "../../../swagger.json";
import createConnection from "../typeorm";

void createConnection();

const port = 3333;
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
