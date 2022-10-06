import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";

import { ICarsRepository } from "../ICarsRepository";

export class InMemoryCarsRepository implements ICarsRepository {
  private readonly cars: Car[];

  constructor() {
    this.cars = [];
  }

  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
    id,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();
    Object.assign(car, {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      created_at: new Date(),
      specifications: specifications || [],
    });

    if (id) {
      car.id = id;
      const index = this.cars.findIndex(({ id }) => car.id === id);
      const carAlreadyExists = index > -1;

      if (carAlreadyExists) {
        this.cars[index] = car;
      } else {
        this.cars.push(car);
      }
    } else {
      this.cars.push(car);
    }
    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = this.cars.find((car) => car.license_plate === license_plate);
    return car;
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    if (brand || category_id || name) {
      return this.cars.filter(
        (car) =>
          car.available &&
          ((brand && car.brand === brand) ||
            (category_id && car.category_id === category_id) ||
            (name && car.name === name))
      );
    }
    return this.cars.filter((car) => car.available);
  }

  async findById(id: string, details?: boolean): Promise<Car> {
    const car = this.cars.find((car) => car.id === id);
    return car;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const index = this.cars.findIndex((car) => car.id === id);
    this.cars[index].available = available;
  }
}
