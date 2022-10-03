import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

@injectable()
export class GetCarByIdCarUseCase {
  constructor(
    @inject("CarsRepository")
    private readonly carsRepository: ICarsRepository
  ) {}

  async execute(id: string): Promise<Car> {
    const car = await this.carsRepository.findById(id, true);
    return car;
  }
}
