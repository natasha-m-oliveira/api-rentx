import { ICreateSpecificationDTO } from "@modules/cars/dtos/ICreateSpecificationDTO";
import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";

import { ISpecificationsRepository } from "../ISpecificationsRepository";

export class InMemorySpecificationsRepository
  implements ISpecificationsRepository
{
  private readonly specifications: Specification[] = [];

  constructor() {
    this.specifications = [];
  }

  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification();

    Object.assign(specification, {
      name,
      description,
      created_at: new Date(),
    });

    this.specifications.push(specification);

    return specification;
  }

  async findByName(name: string): Promise<Specification> {
    const specification = this.specifications.find(
      (specification) => specification.name === name
    );
    return specification;
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const all = this.specifications.filter((specification) =>
      ids.includes(specification.id)
    );

    return all;
  }

  async list(): Promise<Specification[]> {
    return this.specifications;
  }
}
