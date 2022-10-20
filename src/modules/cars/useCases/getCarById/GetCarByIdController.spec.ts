import { hash } from "bcrypt";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";

let connection: Connection;
let access_token: string;

describe("Get Car By Id", () => {
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

  it("should be able to get car by id", async () => {
    const responseCategory = await request(app)
      .post("/api/v1/categories")
      .send({
        name: "Sedan",
        description: "Automóvel de três volumes",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const category_id = responseCategory.body.id;

    const responseCar = await request(app)
      .post("/api/v1/cars")
      .send({
        name: "Honda City",
        description: "Direção confortável e economia.",
        daily_rate: 230,
        license_plate: "NAN-2313",
        fine_amount: 90,
        brand: "Honda",
        category_id,
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const car_id: string = responseCar.body.id;

    const response = await request(app)
      .get(`/api/v1/cars/${car_id}`)
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(responseCar.body.name);
  });
});
