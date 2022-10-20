/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Rental } from "../infra/typeorm/entities/Rental";

export class RentalMap {
  static toDTO({
    id,
    car_id,
    user_id,
    start_date,
    end_date,
    expected_return_date,
    total,
    created_at,
    updated_at,
  }: Rental): Omit<Rental, "car"> {
    return {
      id,
      car_id,
      user_id,
      start_date,
      end_date,
      expected_return_date,
      total: Number(total) / 100,
      created_at,
      updated_at,
    };
  }
}
