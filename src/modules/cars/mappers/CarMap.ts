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
    brand,
    category_id,
    specifications,
    images,
    created_at,
  }: Car): Omit<Car, "category"> {
    return {
      id,
      name,
      description,
      daily_rate: Number(daily_rate) / 100,
      available,
      license_plate,
      fine_amount: Number(fine_amount) / 100,
      brand,
      category_id,
      specifications,
      images,
      created_at,
    };
  }
}
