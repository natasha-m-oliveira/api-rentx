import { hash } from "bcrypt";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";

let connection: Connection;
let access_token: string;
describe("Create Specification", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, is_admin, created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, now(), 'XXXXXX')`
    );

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    access_token = responseToken.body.access_token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new specification", async () => {
    const response = await request(app)
      .post("/api/v1/specifications")
      .send({
        name: "Câmbio automático",
        description: "Carro com câmbio automático",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    expect(response.status).toBe(201);
  });

  it("should not be able to create specification already exists", async () => {
    const response = await request(app)
      .post("/api/v1/specifications")
      .send({
        name: "Câmbio automático",
        description: "Carro com câmbio automático",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    expect(response.status).toBe(400);
  });
});
