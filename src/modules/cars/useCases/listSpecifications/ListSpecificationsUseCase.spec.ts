import { InMemorySpecificationsRepository } from "@modules/cars/repositories/implementations/InMemorySpecificationsRepository";

import { ListSpecificationsUseCase } from "./ListSpecificationsUseCase";

let listSpecificationsUseCase: ListSpecificationsUseCase;
let specificationsRepository: InMemorySpecificationsRepository;
describe("List Specifications", () => {
  beforeEach(() => {
    specificationsRepository = new InMemorySpecificationsRepository();
    listSpecificationsUseCase = new ListSpecificationsUseCase(
      specificationsRepository
    );
  });

  it("should be able to list all specifications", async () => {
    const specification = await specificationsRepository.create({
      name: "Tração dianteira",
      description: "Maior espaço interno e segurança ao condutor inexperiente",
    });
    const specifications = await listSpecificationsUseCase.execute();
    expect(specifications).toEqual([specification]);
  });
});
