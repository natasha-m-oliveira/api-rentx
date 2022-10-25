import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { IBrandsRepository } from "@modules/cars/repositories/IBrandsRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

import { CreateCarError } from "./CreateCarError";

interface IRequest {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand_id: string;
  category_id: string;
}

@injectable()
export class CreateCarUseCase {
  constructor(
    @inject("CarsRepository")
    private readonly carsRepository: ICarsRepository,
    @inject("CategoriesRepository")
    private readonly categoriesRepository: ICategoriesRepository,
    @inject("BrandsRepository")
    private readonly brandsRepository: IBrandsRepository
  ) {}

  async execute({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand_id,
    category_id,
  }: IRequest): Promise<Car> {
    const carAlreadyExists = await this.carsRepository.findByLicensePlate(
      license_plate
    );

    if (carAlreadyExists) {
      throw new CreateCarError.CarAlreadyExists();
    }

    const category = await this.categoriesRepository.findById(category_id);

    if (!category) {
      throw new CreateCarError.CategoryNotFound();
    }

    const brand = await this.brandsRepository.findById(brand_id);

    if (!brand) {
      throw new CreateCarError.BrandNotFound();
    }

    const car = await this.carsRepository.create({
      name,
      description,
      daily_rate: Math.trunc(daily_rate * 100),
      license_plate,
      fine_amount: Math.trunc(fine_amount * 100),
      brand_id,
      category_id,
    });

    return car;
  }
}
