import { InMemoryBrandsRepository } from "@modules/cars/repositories/implementations/InMemoryBrandsRepository";

import { CreateBrandError } from "./CreateBrandError";
import { CreateBrandUseCase } from "./CreateBrandUseCase";

let createBrandUseCase: CreateBrandUseCase;
let brandsRepository: InMemoryBrandsRepository;

describe("Create Brand", () => {
  beforeEach(() => {
    brandsRepository = new InMemoryBrandsRepository();
    createBrandUseCase = new CreateBrandUseCase(brandsRepository);
  });

  it("should be able to create a new brand", async () => {
    const brand = {
      name: "Brand Test",
    };
    await createBrandUseCase.execute(brand);

    const brandCreated = await brandsRepository.findByName(brand.name);

    expect(brandCreated).toHaveProperty("id");
  });

  it("should be able to create a new brand with name exists", async () => {
    const brand = {
      name: "Brand Test",
      description: "Brand description Test",
    };
    await createBrandUseCase.execute(brand);

    await expect(createBrandUseCase.execute(brand)).rejects.toBeInstanceOf(
      CreateBrandError
    );
  });
});
