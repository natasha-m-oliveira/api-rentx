import { inject, injectable } from "tsyringe";

import { Brand } from "@modules/cars/infra/typeorm/entities/Brand";
import { IBrandsRepository } from "@modules/cars/repositories/IBrandsRepository";

import { CreateBrandError } from "./CreateBrandError";

interface IRequest {
  name: string;
}

@injectable()
export class CreateBrandUseCase {
  constructor(
    @inject("BrandsRepository")
    private readonly brandsRepository: IBrandsRepository
  ) {}

  async execute({ name }: IRequest): Promise<Brand> {
    const brandAlreadyExists = await this.brandsRepository.findByName(name);
    if (brandAlreadyExists) {
      throw new CreateBrandError();
    }
    const brand = await this.brandsRepository.create({ name });

    return brand;
  }
}
