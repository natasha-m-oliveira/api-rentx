import { hash } from "bcrypt";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { app } from "@shared/infra/http/app";

let connection: Connection;
let access_token: string;
let dateProvider: DayjsDateProvider;
describe("List Rentals By User", () => {
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
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all rentals by user", async () => {
    const responseCategory = await request(app)
      .post("/api/v1/categories")
      .send({
        name: "Conversível",
        description: "Utilitário esportivo",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const category_id = responseCategory.body.id;

    const responseCar = await request(app)
      .post("/api/v1/cars")
      .send({
        name: "Ferrari Portofino",
        description:
          "A Ferrari é conhecida por seus motores e estilo, e o V8 de 3,9 litros com turbo duplo escondido sob o capô alongado do Portofino é excelente.",
        daily_rate: 2899,
        license_plate: "HRL-4358",
        fine_amount: 789,
        brand: "Ferrari",
        category_id,
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const car_id = responseCar.body.id;

    const responseRental = await request(app)
      .post("/api/v1/rentals")
      .send({
        car_id,
        expected_return_date: dateProvider.addDays(30),
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const response = await request(app)
      .get("/api/v1/rentals/user")
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body[0].id).toBe(responseRental.body.id);
  });
});
