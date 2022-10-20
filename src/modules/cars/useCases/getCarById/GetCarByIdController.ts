import { Request, Response } from "express";
import { container } from "tsyringe";

import { CarMap } from "@modules/cars/mappers/CarMap";

import { GetCarByIdCarUseCase } from "./GetCarByIdUseCase";

export class GetCarByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findCarById = container.resolve(GetCarByIdCarUseCase);

    const car = await findCarById.execute(id);

    const carDTO = CarMap.toDTO(car);

    return response.json(carDTO);
  }
}
