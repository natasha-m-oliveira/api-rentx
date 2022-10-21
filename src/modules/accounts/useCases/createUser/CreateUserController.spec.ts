import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "@shared/infra/http/app";

let connection: Connection;
describe("Create User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Esther Lane",
      email: "muh@dekad.km",
      password: "293663",
      driver_license: "88229447707",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to create user already exists", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Elizabeth Buchanan",
      email: "muh@dekad.km",
      password: "747108",
      driver_license: "58846713189",
    });

    expect(response.status).toBe(400);
  });
});
