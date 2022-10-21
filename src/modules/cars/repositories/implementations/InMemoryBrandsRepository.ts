import { ICreateBrandDTO } from "@modules/cars/dtos/ICreateBrandDTO";
import { Brand } from "@modules/cars/infra/typeorm/entities/Brand";

import { IBrandsRepository } from "../IBrandsRepository";

export class InMemoryBrandsRepository implements IBrandsRepository {
  private readonly brands: Brand[];

  constructor() {
    this.brands = [];
  }

  async create({ name }: ICreateBrandDTO): Promise<Brand> {
    const brand = new Brand();

    Object.assign(brand, {
      name,
      created_at: new Date(),
    });

    this.brands.push(brand);

    return brand;
  }

  async list(): Promise<Brand[]> {
    return this.brands;
  }

  async findByName(name: string): Promise<Brand> {
    const brand = this.brands.find((brand) => brand.name === name);
    return brand;
  }

  async findById(id: string): Promise<Brand> {
    const brand = this.brands.find((brand) => brand.id === id);
    return brand;
  }
}
