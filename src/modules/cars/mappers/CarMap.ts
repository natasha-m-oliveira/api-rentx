/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Car } from "../infra/typeorm/entities/Car";

export class CarMap {
  static toDTO({
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
  }: Car): Omit<Car, "category" | "brand"> {
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
}
