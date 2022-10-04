import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

import { IRentalsRepository } from "../IRentalsRepository";

export class InMemoryRentalsRepository implements IRentalsRepository {
  private readonly rentals: Rental[];

  constructor() {
    this.rentals = [];
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const rental = this.rentals.find(
      (rental) => rental.car_id === car_id && !rental.end_date
    );
    return rental;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const rental = this.rentals.find(
      (rental) => rental.user_id === user_id && !rental.end_date
    );
    return rental;
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
    id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();
    const date = new Date();

    Object.assign(rental, {
      car_id,
      user_id,
      expected_return_date,
      start_date: date,
      created_at: date,
      updated_at: date,
      id,
      end_date,
      total,
    });

    this.rentals.push(rental);

    return rental;
  }

  async findById(id: string): Promise<Rental> {
    const rental = this.rentals.find((rental) => rental.id === id);
    return rental;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentalsByUser = this.rentals.filter(
      (rental) => rental.user_id === user_id
    );
    return rentalsByUser;
  }
}
