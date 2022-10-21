import { ICreateBrandDTO } from "../dtos/ICreateBrandDTO";
import { Brand } from "../infra/typeorm/entities/Brand";

export interface IBrandsRepository {
  findByName: (name: string) => Promise<Brand>;
  list: () => Promise<Brand[]>;
  create: ({ name }: ICreateBrandDTO) => Promise<Brand>;
  findById: (id: string) => Promise<Brand>;
}
