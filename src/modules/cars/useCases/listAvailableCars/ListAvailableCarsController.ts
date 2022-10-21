import { Request, Response } from "express";
import { container } from "tsyringe";

import { AvailableCars } from "@modules/cars/mappers/AvailableCars";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

export class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { brand_id, name, category_id } = request.query;

    const listAvailableCarsUseCase = container.resolve(
      ListAvailableCarsUseCase
    );

    const cars = await listAvailableCarsUseCase.execute({
      brand_id: brand_id as string,
      name: name as string,
      category_id: category_id as string,
    });

    const availableCarsDTO = AvailableCars.toDTO(cars);

    return response.json(availableCarsDTO);
  }
}
