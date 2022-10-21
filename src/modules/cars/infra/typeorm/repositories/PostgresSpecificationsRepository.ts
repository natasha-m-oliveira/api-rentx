import { getRepository, Repository } from "typeorm";

import { ICreateSpecificationDTO } from "@modules/cars/dtos/ICreateSpecificationDTO";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";

import { Specification } from "../entities/Specification";

export class PostgresSpecificationsRepository
  implements ISpecificationsRepository
{
  private readonly repository: Repository<Specification>;

  constructor() {
    this.repository = getRepository(Specification);
  }

  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = this.repository.create({
      description,
      name,
    });

    await this.repository.save(specification);

    return specification;
  }

  async findByName(name: string): Promise<Specification> {
    const specification = await this.repository.findOne({
      name,
    });
    return specification;
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const all = await this.repository.findByIds(ids);

    return all;
  }

  async list(): Promise<Specification[]> {
    const all = await this.repository.find();
    return all;
  }
}
