import { InMemoryCategoriesRepository } from "@modules/cars/repositories/implementations/InMemoryCategoriesRepository";

import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

let listCategoriesUseCase: ListCategoriesUseCase;
let categoriesRepository: InMemoryCategoriesRepository;
describe("List Categories", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepository);
  });

  it("should be able to list all categories", async () => {
    await categoriesRepository.create({
      name: "Hatch",
      description: "Carro curto",
    });
    const categories = await listCategoriesUseCase.execute();
    expect(categories.length).toBe(1);
  });
});
