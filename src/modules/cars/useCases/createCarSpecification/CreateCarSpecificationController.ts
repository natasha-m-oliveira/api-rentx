import { Request, Response } from "express";
import { container } from "tsyringe";

import { CarMap } from "@modules/cars/mappers/CarMap";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

export class CreateCarSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { specifications_id } = request.body;
    const createCarSpecificationUseCase = container.resolve(
      CreateCarSpecificationUseCase
    );

    const car = await createCarSpecificationUseCase.execute({
      car_id: id,
      specifications_id,
    });

    const carDTO = CarMap.toDTO(car);

    return response.status(201).json(carDTO);
  }
}
