import { InMemoryCarsRepository } from "@modules/cars/repositories/implementations/InMemoryCarsRepository";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepository: InMemoryCarsRepository;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepository = new InMemoryCarsRepository();
    createCarUseCase = new CreateCarUseCase(carsRepository);
  });

  it("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });
    expect(car).toHaveProperty("id");
  });

  it("should not be able to create a car with exists license plate", () => {
    const car = {
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    };
    void expect(async () => {
      await createCarUseCase.execute({
        ...car,
        name: "Car1",
      });
      await createCarUseCase.execute({
        ...car,
        name: "Car2",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a new car with available true be default", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });
    expect(car.available).toBe(true);
  });
});