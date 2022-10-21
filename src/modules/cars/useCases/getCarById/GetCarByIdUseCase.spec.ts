import { InMemoryCarsRepository } from "@modules/cars/repositories/implementations/InMemoryCarsRepository";

import { GetCarByIdCarUseCase } from "./GetCarByIdUseCase";

let getCarByIdCarUseCase: GetCarByIdCarUseCase;
let carsRepository: InMemoryCarsRepository;
describe("Get Car By Id", () => {
  beforeEach(() => {
    carsRepository = new InMemoryCarsRepository();
    getCarByIdCarUseCase = new GetCarByIdCarUseCase(carsRepository);
  });

  it("should be able to get car by id", async () => {
    const car = await carsRepository.create({
      name: "Car",
      description: "description",
      daily_rate: 110,
      brand_id: "brand_id",
      category_id: "category_id",
      fine_amount: 50,
      license_plate: "HQW-4485",
    });

    const result = await getCarByIdCarUseCase.execute(car.id);

    expect(result).toEqual(car);
  });
});
