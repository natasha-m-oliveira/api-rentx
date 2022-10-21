import { InMemoryCarsRepository } from "@modules/cars/repositories/implementations/InMemoryCarsRepository";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listCarsUseCase: ListAvailableCarsUseCase;
let carsRepository: InMemoryCarsRepository;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepository = new InMemoryCarsRepository();
    listCarsUseCase = new ListAvailableCarsUseCase(carsRepository);
  });

  it("should be able to list all available cars", async () => {
    const car = await carsRepository.create({
      name: "Car1",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepository.create({
      name: "Car2",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "car_brand_test",
      category_id: "category",
    });

    const cars = await listCarsUseCase.execute({ brand: "car_brand_test" });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepository.create({
      name: "Car3",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "car_brand_test",
      category_id: "category",
    });

    const cars = await listCarsUseCase.execute({ name: "Car" });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category", async () => {
    const car = await carsRepository.create({
      name: "Car4",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "car_brand_test",
      category_id: "category",
    });

    const cars = await listCarsUseCase.execute({ category_id: "category" });

    expect(cars).toEqual([car]);
  });
});
