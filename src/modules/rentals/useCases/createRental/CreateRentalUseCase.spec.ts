import dayjs from "dayjs";

import { InMemoryCarsRepository } from "@modules/cars/repositories/implementations/InMemoryCarsRepository";
import { CreateCarUseCase } from "@modules/cars/useCases/createCar/CreateCarUseCase";
import { InMemoryRentalsRepository } from "@modules/rentals/repositories/implementations/InMemoryRentalsRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

import { CreateRentalError } from "./CreateRentalError";
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
    await expect(
      createRentalUseCase.execute({
        user_id: "12345",
        car_id: "1",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new CreateRentalError.CarNotFound());
  });

  it("should not be able to crate a new rental if there is another open to the same user", async () => {
    await carsRepository.create({
      name: "car1",
      description: "description1",
      daily_rate: 100,
      license_plate: "xxx-xxy",
      fine_amount: 20,
      brand: "brand",
      category_id: "1",
      id: "17864",
    });

    await carsRepository.create({
      name: "car2",
      description: "description2",
      daily_rate: 100,
      license_plate: "xxx-xxz",
      fine_amount: 20,
      brand: "brand",
      category_id: "1",
      id: "17865",
    });

    await createRentalUseCase.execute({
      user_id: "12345",
      car_id: "17864",
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "12345",
        car_id: "17865",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new CreateRentalError.RentalInProgress());
  });

  it("should not be able to crate a new rental if there is another open to the same car", async () => {
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
    await expect(
      createRentalUseCase.execute({
        user_id: "12345",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new CreateRentalError.CarIsUnavailable());
  });

  it("should not be able to crate a new rental with invalid return time", async () => {
    const car = await createCarUseCase.execute({
      name: "Test",
      description: "description",
      daily_rate: 110,
      brand: "brand",
      category_id: "category_id",
      fine_amount: 50,
      license_plate: "xxxxx-xx",
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "12344",
        car_id: car.id,
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new CreateRentalError.InvalidReturnTime());
  });
});
