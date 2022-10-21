import { Request, Response } from "express";
import { container } from "tsyringe";

import { CarMap } from "@modules/cars/mappers/CarMap";

import { CreateCarUseCase } from "./CreateCarUseCase";

export class CreateCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand_id,
      category_id,
    } = request.body;
    const createCarUseCase = container.resolve(CreateCarUseCase);

    const car = await createCarUseCase.execute({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand_id,
      category_id,
    });

    const carDTO = CarMap.toDTO(car);

    return response.status(201).json(carDTO);
  }
}
