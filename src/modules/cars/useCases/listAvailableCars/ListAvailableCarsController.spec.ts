import { hash } from "bcrypt";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { app } from "@shared/infra/http/app";

let connection: Connection;
let car: Car;
describe("List Cars", () => {
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

    const access_token: string = responseToken.body.access_token;

    const responseBrand = await request(app)
      .post("/api/v1/brands")
      .send({
        name: "Chevrolet",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const brand_id = responseBrand.body.id;

    const responseCategory = await request(app)
      .post("/api/v1/categories")
      .send({
        name: "Hatch",
        description: "Carro curto",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const category_id = responseCategory.body.id;

    const responseCar = await request(app)
      .post("/api/v1/cars")
      .send({
        name: "Chevrolet Cruze Hatchback",
        description: "O Cruze Sport6 é o único remanescente da categoria.",
        daily_rate: 380,
        license_plate: "IPW-0531",
        fine_amount: 199,
        brand_id,
        category_id,
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    car = responseCar.body;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all available cars by brand", async () => {
    const response = await request(app).get("/api/v1/cars/available").query({
      brand_id: car.brand_id,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const response = await request(app).get("/api/v1/cars/available").query({
      name: "Cruze",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([car]);
  });

  it("should be able to list all available cars by category", async () => {
    const response = await request(app).get("/api/v1/cars/available").query({
      category_id: car.category_id,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([car]);
  });
});
