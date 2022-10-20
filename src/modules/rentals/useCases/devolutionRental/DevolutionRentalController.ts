import { Request, Response } from "express";
import { container } from "tsyringe";

import { RentalMap } from "@modules/rentals/mappers/RentalMap";

import { DevolutionRentalUseCase } from "./DevolutionRentalUseCase";

export class DevolutionRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const devolutionRentalUseCase = container.resolve(DevolutionRentalUseCase);
    const rental = await devolutionRentalUseCase.execute({
      id,
    });

    const rentalDTO = RentalMap.toDTO(rental);

    return response.json(rentalDTO);
  }
}
