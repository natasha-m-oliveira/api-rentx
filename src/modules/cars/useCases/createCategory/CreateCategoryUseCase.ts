import { inject, injectable } from "tsyringe";

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

  async execute({ name, description }: IRequest): Promise<void> {
    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      name
    );
    if (categoryAlreadyExists) {
      throw new CreateCategoryError();
    }
    await this.categoriesRepository.create({
      name,
      description,
    });
  }
}
