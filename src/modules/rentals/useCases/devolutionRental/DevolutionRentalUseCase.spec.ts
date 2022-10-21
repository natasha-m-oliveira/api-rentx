import { InMemoryCarsRepository } from "@modules/cars/repositories/implementations/InMemoryCarsRepository";
import { InMemoryRentalsRepository } from "@modules/rentals/repositories/implementations/InMemoryRentalsRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

import { DevolutionRentalError } from "./DevolutionRentalError";
import { DevolutionRentalUseCase } from "./DevolutionRentalUseCase";

let devolutionRentalUseCase: DevolutionRentalUseCase;
let carsRepository: InMemoryCarsRepository;
let rentalsRepository: InMemoryRentalsRepository;
let dateProvider: DayjsDateProvider;

describe("Devolution Rental", () => {
  beforeEach(() => {
    rentalsRepository = new InMemoryRentalsRepository();
    carsRepository = new InMemoryCarsRepository();
    dateProvider = new DayjsDateProvider();
    devolutionRentalUseCase = new DevolutionRentalUseCase(
      rentalsRepository,
      carsRepository,
      dateProvider
    );
  });

  it("should be able to devolution a rental", async () => {
    const car = await carsRepository.create({
      name: "Car",
      description: "description",
      daily_rate: 110,
      brand_id: "brand_id",
      category_id: "category_id",
      fine_amount: 50,
      license_plate: "AXL-9604",
    });
    const rental = await rentalsRepository.create({
      car_id: car.id,
      user_id: "user_id",
      expected_return_date: dateProvider.addDays(1),
    });

    const devolutionRental = await devolutionRentalUseCase.execute({
      id: rental.id,
    });

    expect(devolutionRental).toHaveProperty("end_date");
    expect(devolutionRental).toHaveProperty("total");
    expect(devolutionRental.total).toBe(car.daily_rate);
  });

  it("should not be able to devolution non-existent rental", async () => {
    await expect(
      devolutionRentalUseCase.execute({
        id: "invalid_id",
      })
    ).rejects.toBeInstanceOf(DevolutionRentalError);
  });
});
