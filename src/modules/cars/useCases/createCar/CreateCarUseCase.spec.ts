import { InMemoryCarsRepository } from "@modules/cars/repositories/implementations/InMemoryCarsRepository";
import { InMemoryCategoriesRepository } from "@modules/cars/repositories/implementations/InMemoryCategoriesRepository";

import { CreateCategoryUseCase } from "../createCategory/CreateCategoryUseCase";
import { CreateCarError } from "./CreateCarError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let createCategoryUseCase: CreateCategoryUseCase;
let carsRepository: InMemoryCarsRepository;
let categoriesRepository: InMemoryCategoriesRepository;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepository = new InMemoryCarsRepository();
    categoriesRepository = new InMemoryCategoriesRepository();
    createCarUseCase = new CreateCarUseCase(
      carsRepository,
      categoriesRepository
    );
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository);
  });

  it("should be able to create a new car", async () => {
    const category = await createCategoryUseCase.execute({
      name: "SUV",
      description: "Utilitário esportivo",
    });

    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: category.id,
    });
    expect(car).toHaveProperty("id");
  });

  it("should not be able to create a car with exists license plate", async () => {
    const category = await createCategoryUseCase.execute({
      name: "SUV",
      description: "Utilitário esportivo",
    });

    const car = {
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: category.id,
    };

    await createCarUseCase.execute({
      ...car,
      name: "Car1",
    });

    await expect(
      createCarUseCase.execute({
        ...car,
        name: "Car2",
      })
    ).rejects.toEqual(new CreateCarError.CarAlreadyExists());
  });

  it("should be able to create a new car with available true be default", async () => {
    const category = await createCategoryUseCase.execute({
      name: "SUV",
      description: "Utilitário esportivo",
    });

    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: category.id,
    });
    expect(car.available).toBeTruthy();
  });

  it("should not be able to create car with a non-existent category", async () => {
    await expect(
      createCarUseCase.execute({
        name: "Name Car",
        description: "Description Car",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Brand",
        category_id: "invalid_category",
      })
    ).rejects.toEqual(new CreateCarError.CategoryNotFound());
  });
});
