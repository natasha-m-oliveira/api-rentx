/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Car } from "../infra/typeorm/entities/Car";

export class AvailableCars {
  static toDTO(cars: Car[]): Array<Omit<Car, "category" | "brand">> {
    return cars.map(
      ({
        id,
        name,
        description,
        daily_rate,
        available,
        license_plate,
        fine_amount,
        brand_id,
        category_id,
        specifications,
        images,
        created_at,
      }) => {
        return {
          id,
          name,
          description,
          daily_rate: Number(daily_rate) / 100,
          available,
          license_plate,
          fine_amount: Number(fine_amount) / 100,
          brand_id,
          category_id,
          specifications,
          images,
          created_at,
        };
      }
    );
  }
}
