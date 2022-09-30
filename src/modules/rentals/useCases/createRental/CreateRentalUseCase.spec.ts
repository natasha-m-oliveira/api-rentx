import dayjs from "dayjs";

import { InMemoryRentalsRepository } from "@modules/rentals/repositories/implementations/InMemoryRentalsRepository";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepository: InMemoryRentalsRepository;
describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepository = new InMemoryRentalsRepository();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepository);
  });

  it("should be able to crate a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: "121212",
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to crate a new rental if there is another open to the same user", async () => {
    void expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "121211",
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "121212",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to crate a new rental if there is another open to the same car", async () => {
    void expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12344",
        car_id: "121212",
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "121212",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to crate a new rental with invalid return time", async () => {
    void expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12344",
        car_id: "121212",
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
