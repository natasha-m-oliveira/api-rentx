import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetCarByIdCarUseCase } from "./GetCarByIdUseCase";

export class GetCarByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findCarById = container.resolve(GetCarByIdCarUseCase);

    const car = await findCarById.execute(id);

    return response.json(car);
  }
}
