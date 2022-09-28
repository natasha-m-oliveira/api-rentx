import { ICreateSpecificationDTO } from "../dtos/ICreateSpecificationDTO";
import { Specification } from "../infra/typeorm/entities/Specification";

export interface ISpecificationsRepository {
  create: ({ name, description }: ICreateSpecificationDTO) => Promise<void>;
  findByName: (name: string) => Promise<Specification>;
}
