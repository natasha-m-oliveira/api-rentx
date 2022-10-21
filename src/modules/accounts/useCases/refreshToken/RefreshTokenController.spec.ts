import { hash } from "bcrypt";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";

let connection: Connection;
describe("Refresh Token", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("272474", 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, is_admin, created_at, driver_license)
      values('${id}', 'Miguel Freeman', 'ru@bumlef.lu', '${password}', false, now(), '75310854963')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to refresh token", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "ru@bumlef.lu",
      password: "272474",
    });

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/api/v1/refresh-token").send({
      refresh_token,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body).toHaveProperty("refresh_token");
  });

  it("should not be able to refresh token", async () => {
    const response = await request(app).post("/api/v1/refresh-token").send({
      refresh_token: "invalid_token",
    });

    expect(response.status).toBe(401);
  });
});
