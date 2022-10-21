import { hash } from "bcrypt";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";

let connection: Connection;
let access_token: string;
describe("Create Car", () => {
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

  it("should be able to create a new car", async () => {
    const responseBrand = await request(app)
      .post("/api/v1/brands")
      .send({
        name: "Willys Overland",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const brand_id = responseBrand.body.id;

    const responseCategory = await request(app)
      .post("/api/v1/categories")
      .send({
        name: "SUV",
        description: "Utilitário esportivo",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const category_id = responseCategory.body.id;
    const response = await request(app)
      .post("/api/v1/cars")
      .send({
        name: "Willys Interlagos",
        description: "Primeiro automóvel esportivo produzido no Brasil",
        daily_rate: 580,
        license_plate: "IGF-7075",
        fine_amount: 399,
        brand_id,
        category_id,
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });
    expect(response.status).toBe(201);
    expect(response.body.available).toBeTruthy();
  });
});
