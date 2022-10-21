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
describe("Devolution Rental", () => {
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

    const responseBrand = await request(app)
      .post("/api/v1/brands")
      .send({
        name: "Kia",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const brand_id = responseBrand.body.id;

    const responseCategory = await request(app)
      .post("/api/v1/categories")
      .send({
        name: "Caminhão",
        description: "São os chamados VUC, voltados para uso na cidade",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const category_id = responseCategory.body.id;

    const responseCar = await request(app)
      .post("/api/v1/cars")
      .send({
        name: "Kia Bongo",
        description:
          "Caminhão apto a circular nas cidades. É oferecido na versão com chassi e pode transportar mais de 1,5 tonelada.",
        daily_rate: 1250,
        license_plate: "AYG-3051",
        fine_amount: 456,
        brand_id,
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

  it("should be able to devolution a rental", async () => {
    const responseRental = await request(app)
      .post("/api/v1/rentals")
      .send({
        car_id,
        expected_return_date: dateProvider.addDays(30),
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });
    const rental_id: string = responseRental.body.id;
    const response = await request(app)
      .post(`/api/v1/rentals/${rental_id}/devolution`)
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("end_date");
    expect(response.body).toHaveProperty("total");
  });
});
