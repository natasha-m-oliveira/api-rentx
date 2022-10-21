import { InMemoryBrandsRepository } from "@modules/cars/repositories/implementations/InMemoryBrandsRepository";

import { ListBrandsUseCase } from "./ListBrandsUseCase";

let listBrandsUseCase: ListBrandsUseCase;
let brandsRepository: InMemoryBrandsRepository;
describe("List Brands", () => {
  beforeEach(() => {
    brandsRepository = new InMemoryBrandsRepository();
    listBrandsUseCase = new ListBrandsUseCase(brandsRepository);
  });

  it("should be able to list all brands", async () => {
    const brand = await brandsRepository.create({
      name: "Porsche",
    });
    const brands = await listBrandsUseCase.execute();
    expect(brands).toEqual([brand]);
  });
});
