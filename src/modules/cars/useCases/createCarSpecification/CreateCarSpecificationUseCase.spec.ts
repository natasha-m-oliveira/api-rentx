import { InMemoryCarsRepository } from "@modules/cars/repositories/implementations/InMemoryCarsRepository";
import { InMemorySpecificationsRepository } from "@modules/cars/repositories/implementations/InMemorySpecificationsRepository";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepository: InMemoryCarsRepository;
let specificationsRepository: InMemorySpecificationsRepository;
describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepository = new InMemoryCarsRepository();
    specificationsRepository = new InMemorySpecificationsRepository();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepository,
      specificationsRepository
    );
  });

  it("should not be able to add a new specification to a now-existent car", async () => {
    const car_id = "1234";
    const specifications_id = ["54321"];
    void expect(async () => {
      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to add a new specification to the car", async () => {
    const car = await carsRepository.create({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });
    const specifications_id = ["54321"];

    await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });
  });
});