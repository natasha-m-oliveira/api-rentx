import { getRepository, Repository } from "typeorm";

import { ICreateBrandDTO } from "@modules/cars/dtos/ICreateBrandDTO";
import { IBrandsRepository } from "@modules/cars/repositories/IBrandsRepository";

import { Brand } from "../entities/Brand";

export class PostgresBrandsRepository implements IBrandsRepository {
  private readonly repository: Repository<Brand>;

  constructor() {
    this.repository = getRepository(Brand);
  }

  async create({ name }: ICreateBrandDTO): Promise<Brand> {
    const brand = this.repository.create({ name });
    await this.repository.save(brand);
    return brand;
  }

  async list(): Promise<Brand[]> {
    const brands = await this.repository.find();
    return brands;
  }

  async findByName(name: string): Promise<Brand> {
    const brand = await this.repository.findOne({
      name,
    });
    return brand;
  }

  async findById(id: string): Promise<Brand> {
    const brand = await this.repository.findOne(id);
    return brand;
  }
}
