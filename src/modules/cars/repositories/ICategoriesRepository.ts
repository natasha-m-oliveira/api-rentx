import { ICreateCategoryDTO } from "../dtos/ICreateCategoryDTO";
import { Category } from "../infra/typeorm/entities/Category";

export interface ICategoriesRepository {
  findByName: (name: string) => Promise<Category>;
  list: () => Promise<Category[]>;
  create: ({ name, description }: ICreateCategoryDTO) => Promise<Category>;
  findById: (id: string) => Promise<Category>;
}
