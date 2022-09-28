import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import "./database";
import "./shared/container";

import { errorHandler } from "@middlewares/errorHandler";

import { router } from "./routes";
import swaggerFile from "./swagger.json";

const port = 3333;
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
