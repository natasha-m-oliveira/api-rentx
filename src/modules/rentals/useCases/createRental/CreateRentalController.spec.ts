import { hash } from "bcrypt";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { app } from "@shared/infra/http/app";

let connection: Connection;
let access_token: string;
let car_id: string;
let dateProvider: DayjsDateProvider;
describe("Create Rental", () => {
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
    dateProvider = new DayjsDateProvider();

    const responseCategory = await request(app)
      .post("/api/v1/categories")
      .send({
        name: "Furgão",
        description: "Utilitários de médio porte",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const category_id = responseCategory.body.id;

    const responseCar = await request(app)
      .post("/api/v1/cars")
      .send({
        name: "Ford Transit",
        description:
          "A van mais vendida na Europa e nos EUA, agora, no Brasil.",
        daily_rate: 199,
        license_plate: "NEL-6421",
        fine_amount: 39,
        brand: "Ford",
        category_id,
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    car_id = responseCar.body.id;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to crate a new rental", async () => {
    const response = await request(app)
      .post("/api/v1/rentals")
      .send({
        car_id,
        expected_return_date: dateProvider.addDays(30),
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    expect(response.status).toBe(201);
  });
});
