import { InMemorySpecificationsRepository } from "@modules/cars/repositories/implementations/InMemorySpecificationsRepository";

import { CreateSpecificationError } from "./CreateSpecificationError";
import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

let createSpecificationUseCase: CreateSpecificationUseCase;
let specificationsRepository: InMemorySpecificationsRepository;
describe("Create Specification", () => {
  beforeEach(() => {
    specificationsRepository = new InMemorySpecificationsRepository();
    createSpecificationUseCase = new CreateSpecificationUseCase(
      specificationsRepository
    );
  });

  it("should be able to create a new specification", async () => {
    const specification = await createSpecificationUseCase.execute({
      name: "Câmbio automático",
      description: "Carro com câmbio automático",
    });

    expect(specification).toHaveProperty("id");
  });

  it("should not be able to create specification already exists", async () => {
    await createSpecificationUseCase.execute({
      name: "4 portas",
      description: "Carro com 4 portas",
    });

    await expect(
      createSpecificationUseCase.execute({
        name: "4 portas",
        description: "Carro com 4 portas",
      })
    ).rejects.toBeInstanceOf(CreateSpecificationError);
  });
});
