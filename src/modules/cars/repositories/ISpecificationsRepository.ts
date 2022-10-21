import { ICreateSpecificationDTO } from "../dtos/ICreateSpecificationDTO";
import { Specification } from "../infra/typeorm/entities/Specification";

export interface ISpecificationsRepository {
  create: ({
    name,
    description,
  }: ICreateSpecificationDTO) => Promise<Specification>;
  findByName: (name: string) => Promise<Specification>;
  findByIds: (ids: string[]) => Promise<Specification[]>;
  list: () => Promise<Specification[]>;
}
