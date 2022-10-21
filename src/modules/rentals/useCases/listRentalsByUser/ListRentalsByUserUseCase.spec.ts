import { InMemoryRentalsRepository } from "@modules/rentals/repositories/implementations/InMemoryRentalsRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";

let listRentalsByUserUseCase: ListRentalsByUserUseCase;
let rentalsRepository: InMemoryRentalsRepository;
let dateProvider: DayjsDateProvider;
describe("List Rentals By User", () => {
  beforeEach(() => {
    rentalsRepository = new InMemoryRentalsRepository();
    dateProvider = new DayjsDateProvider();
    listRentalsByUserUseCase = new ListRentalsByUserUseCase(rentalsRepository);
  });

  it("should be able to list all rentals by user", async () => {
    const rental = await rentalsRepository.create({
      car_id: "car_id",
      user_id: "user_id",
      expected_return_date: dateProvider.addDays(1),
    });

    const userRentals = await listRentalsByUserUseCase.execute(rental.user_id);

    expect(userRentals.length).toBe(1);
  });
});
