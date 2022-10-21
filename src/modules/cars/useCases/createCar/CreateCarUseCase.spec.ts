import { InMemoryBrandsRepository } from "@modules/cars/repositories/implementations/InMemoryBrandsRepository";
import { InMemoryCarsRepository } from "@modules/cars/repositories/implementations/InMemoryCarsRepository";
import { InMemoryCategoriesRepository } from "@modules/cars/repositories/implementations/InMemoryCategoriesRepository";

import { CreateCategoryUseCase } from "../createCategory/CreateCategoryUseCase";
import { CreateCarError } from "./CreateCarError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepository: InMemoryCarsRepository;
let categoriesRepository: InMemoryCategoriesRepository;
let brandsRepository: InMemoryBrandsRepository;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepository = new InMemoryCarsRepository();
    categoriesRepository = new InMemoryCategoriesRepository();
    brandsRepository = new InMemoryBrandsRepository();
    createCarUseCase = new CreateCarUseCase(
      carsRepository,
      categoriesRepository,
      brandsRepository
    );
  });

  it("should be able to create a new car", async () => {
    const brand = await brandsRepository.create({
      name: "Honda",
    });
    const category = await categoriesRepository.create({
      name: "SUV",
      description: "Utilitário esportivo",
    });

    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand_id: brand.id,
      category_id: category.id,
    });
    expect(car).toHaveProperty("id");
  });

  it("should not be able to create a car with exists license plate", async () => {
    const brand = await brandsRepository.create({
      name: "Honda",
    });
    const category = await categoriesRepository.create({
      name: "SUV",
      description: "Utilitário esportivo",
    });

    const car = {
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand_id: brand.id,
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
    const brand = await brandsRepository.create({
      name: "Honda",
    });
    const category = await categoriesRepository.create({
      name: "SUV",
      description: "Utilitário esportivo",
    });

    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand_id: brand.id,
      category_id: category.id,
    });
    expect(car.available).toBeTruthy();
  });

  it("should not be able to create car with a non-existent category", async () => {
    const brand = await brandsRepository.create({
      name: "Honda",
    });
    await expect(
      createCarUseCase.execute({
        name: "Name Car",
        description: "Description Car",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand_id: brand.id,
        category_id: "invalid_category",
      })
    ).rejects.toEqual(new CreateCarError.CategoryNotFound());
  });

  it("should not be able to create car with a non-existent brand", async () => {
    const category = await categoriesRepository.create({
      name: "SUV",
      description: "Utilitário esportivo",
    });

    await expect(
      createCarUseCase.execute({
        name: "Name Car",
        description: "Description Car",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand_id: "invalid_brand",
        category_id: category.id,
      })
    ).rejects.toEqual(new CreateCarError.BrandNotFound());
  });
});
