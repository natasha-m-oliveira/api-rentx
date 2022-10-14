import "reflect-metadata";

import cors from "cors";
import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import "../../container";

import upload from "@config/upload";
import { errorHandler } from "@shared/infra/http/middlewares/errorHandler";
import { router } from "@shared/infra/http/routes";

import swaggerFile from "../../../swagger.json";
import createConnection from "../typeorm";
import { rateLimiter } from "./middlewares/rateLimiter";

void createConnection();

const app = express();

app.use(rateLimiter);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// expondo arquivos estáticos
app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));

app.use(cors());
app.use("/api/v1", router);

app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);

export { app };
