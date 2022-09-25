import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

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
      throw new Error("Category already exists!");
    }
    await this.categoriesRepository.create({
      name,
      description,
    });
  }
}
