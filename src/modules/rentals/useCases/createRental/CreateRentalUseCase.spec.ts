import dayjs from "dayjs";

import { InMemoryUsersRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersRepository";
import { InMemoryCarsRepository } from "@modules/cars/repositories/implementations/InMemoryCarsRepository";
import { InMemoryRentalsRepository } from "@modules/rentals/repositories/implementations/InMemoryRentalsRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

import { CreateRentalError } from "./CreateRentalError";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepository: InMemoryRentalsRepository;
let carsRepository: InMemoryCarsRepository;
let dateProvider: DayjsDateProvider;
let usersRepository: InMemoryUsersRepository;
describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepository = new InMemoryRentalsRepository();
    carsRepository = new InMemoryCarsRepository();
    usersRepository = new InMemoryUsersRepository();
    dateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository,
      dateProvider,
      carsRepository,
      usersRepository
    );
  });

  it("should be able to crate a new rental", async () => {
    const user = await usersRepository.create({
      name: "Millie Casey",
      email: "manfepmen@jarduw.sv",
      password: "690136",
      driver_license: "06519296469",
    });
    const car = await carsRepository.create({
      name: "Test",
      description: "description",
      daily_rate: 110,
      brand: "brand",
      category_id: "category_id",
      fine_amount: 50,
      license_plate: "xxxxx-xx",
    });
    const rental = await createRentalUseCase.execute({
      user_id: user.id,
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental with non-existing car", async () => {
    const user = await usersRepository.create({
      name: "Sue Oliver",
      email: "julajho@jon.mc",
      password: "289934",
      driver_license: "24061817639",
    });

    await expect(
      createRentalUseCase.execute({
        user_id: user.id,
        car_id: "1",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new CreateRentalError.CarNotFound());
  });

  it("should not be able to crate a new rental if there is another open to the same user", async () => {
    const user = await usersRepository.create({
      name: "Eleanor Moss",
      email: "zelu@acijiapo.bs",
      password: "364082",
      driver_license: "61944903436",
    });

    await carsRepository.create({
      name: "car1",
      description: "description1",
      daily_rate: 100,
      license_plate: "MVX-6332",
      fine_amount: 20,
      brand: "brand",
      category_id: "category_id",
      id: "17864",
    });

    await carsRepository.create({
      name: "car2",
      description: "description2",
      daily_rate: 100,
      license_plate: "MUG-9436",
      fine_amount: 20,
      brand: "brand",
      category_id: "category_id",
      id: "17865",
    });

    await createRentalUseCase.execute({
      user_id: user.id,
      car_id: "17864",
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: user.id,
        car_id: "17865",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new CreateRentalError.RentalInProgress());
  });

  it("should not be able to crate a new rental if there is another open to the same car", async () => {
    const firstUser = await usersRepository.create({
      name: "Milton Jefferson",
      email: "kudegov@we.er",
      password: "340150",
      driver_license: "61229622349",
    });

    const secondUser = await usersRepository.create({
      name: "Milton Jefferson",
      email: "kudegov@we.er",
      password: "340150",
      driver_license: "61229622349",
    });

    const car = await carsRepository.create({
      name: "Test",
      description: "description",
      daily_rate: 110,
      brand: "brand",
      category_id: "category_id",
      fine_amount: 50,
      license_plate: "NFB-4637",
    });

    await createRentalUseCase.execute({
      user_id: firstUser.id,
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });
    await expect(
      createRentalUseCase.execute({
        user_id: secondUser.id,
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new CreateRentalError.CarIsUnavailable());
  });

  it("should not be able to crate a new rental with invalid return time", async () => {
    const user = await usersRepository.create({
      name: "Frank Jenkins",
      email: "vuh@tonfanku.pt",
      password: "726830",
      driver_license: "46105406310",
    });

    const car = await carsRepository.create({
      name: "Test",
      description: "description",
      daily_rate: 110,
      brand: "brand",
      category_id: "category_id",
      fine_amount: 50,
      license_plate: "JTW-3538",
    });

    await expect(
      createRentalUseCase.execute({
        user_id: user.id,
        car_id: car.id,
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new CreateRentalError.InvalidReturnTime());
  });
});
