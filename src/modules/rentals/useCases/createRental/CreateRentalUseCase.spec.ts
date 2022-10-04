import dayjs from "dayjs";

import { InMemoryCarsRepository } from "@modules/cars/repositories/implementations/InMemoryCarsRepository";
import { CreateCarUseCase } from "@modules/cars/useCases/createCar/CreateCarUseCase";
import { InMemoryRentalsRepository } from "@modules/rentals/repositories/implementations/InMemoryRentalsRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider.ts/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepository: InMemoryRentalsRepository;
let carsRepository: InMemoryCarsRepository;
let dateProvider: DayjsDateProvider;
let createCarUseCase: CreateCarUseCase;
describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepository = new InMemoryRentalsRepository();
    carsRepository = new InMemoryCarsRepository();
    dateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository,
      dateProvider,
      carsRepository
    );
    createCarUseCase = new CreateCarUseCase(carsRepository);
  });

  it("should be able to crate a new rental", async () => {
    const car = await createCarUseCase.execute({
      name: "Test",
      description: "description",
      daily_rate: 110,
      brand: "brand",
      category_id: "category_id",
      fine_amount: 50,
      license_plate: "xxxxx-xx",
    });
    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental with non-existing car", async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "1",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to crate a new rental if there is another open to the same user", async () => {
    await expect(async () => {
      const car = await createCarUseCase.execute({
        name: "Test",
        description: "description",
        daily_rate: 110,
        brand: "brand",
        category_id: "category_id",
        fine_amount: 50,
        license_plate: "xxxxx-xx",
      });

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to crate a new rental if there is another open to the same car", async () => {
    await expect(async () => {
      const car = await createCarUseCase.execute({
        name: "Test",
        description: "description",
        daily_rate: 110,
        brand: "brand",
        category_id: "category_id",
        fine_amount: 50,
        license_plate: "xxxxx-xx",
      });

      await createRentalUseCase.execute({
        user_id: "12344",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to crate a new rental with invalid return time", async () => {
    await expect(async () => {
      const car = await createCarUseCase.execute({
        name: "Test",
        description: "description",
        daily_rate: 110,
        brand: "brand",
        category_id: "category_id",
        fine_amount: 50,
        license_plate: "xxxxx-xx",
      });

      await createRentalUseCase.execute({
        user_id: "12344",
        car_id: car.id,
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
