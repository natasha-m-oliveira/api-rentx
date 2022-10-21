import { hash } from "bcrypt";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";

let connection: Connection;
let access_token: string;
describe("Create Car Specification", () => {
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

  it("should not be able to add a new specification to a now-existent car", async () => {
    const responseBrand = await request(app)
      .post("/api/v1/brands")
      .send({
        name: "Suzuki",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const brand_id = responseBrand.body.id;

    const responseCategory = await request(app)
      .post("/api/v1/categories")
      .send({
        name: "Jipe",
        description: "Veículos com tradição off-road",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const category_id = responseCategory.body.id;

    const responseCar = await request(app)
      .post("/api/v1/cars")
      .send({
        name: "Suzuki Jimny Sierra",
        description:
          "Reúne personalidade única, resistência, alegria e estilo de vida.",
        daily_rate: 679,
        license_plate: "JNG-2097",
        fine_amount: 199,
        brand_id,
        category_id,
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const car_id: string = responseCar.body.id;

    const responseSpecification = await request(app)
      .post("/api/v1/specifications")
      .send({
        name: "Faróis de Neblina",
        description: "Carro com faróis de neblina",
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    const specification_id = responseSpecification.body.id;

    const response = await request(app)
      .post(`/api/v1/cars/${car_id}/specifications`)
      .send({
        specifications_id: [specification_id],
      })
      .set({
        Authorization: `Bearer ${access_token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.specifications).toEqual([responseSpecification.body]);
  });
});
