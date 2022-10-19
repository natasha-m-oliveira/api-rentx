import { inject, injectable } from "tsyringe";

import { Category } from "@modules/cars/infra/typeorm/entities/Category";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

import { CreateCategoryError } from "./CreateCategoryError";

interface IRequest {
  name: string;
  description: string;
}

@injectable() // Alterações para a injeção
export class CreateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository") // Alterações para a injeção
    private readonly categoriesRepository: ICategoriesRepository
  ) {}

  async execute({ name, description }: IRequest): Promise<Category> {
    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      name
    );
    if (categoryAlreadyExists) {
      throw new CreateCategoryError();
    }
    const category = await this.categoriesRepository.create({
      name,
      description,
    });

    return category;
  }
}
