import { hash } from "bcrypt";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";

import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let connection: Connection;
let error: IncorrectEmailOrPasswordError;
describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    error = new IncorrectEmailOrPasswordError();

    const id = uuidV4();
    const password = await hash("449872", 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, is_admin, created_at, driver_license)
      values('${id}', 'Rosetta Horton', 'tum@apu.al', '${password}', true, now(), '675544011284')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "tum@apu.al",
      password: "449872",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("refresh_token");
    expect(response.body).toHaveProperty("access_token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "false@email.com",
      password: "449872",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(error.message);
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "tum@apu.al",
      password: "incorrectPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(error.message);
  });
});
