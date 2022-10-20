import { Request, Response } from "express";
import { container } from "tsyringe";

import { RentalMap } from "@modules/rentals/mappers/RentalMap";

import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";

export class ListRentalsByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const listRentalsByUserUseCase = container.resolve(
      ListRentalsByUserUseCase
    );
    const rentalsByUser = await listRentalsByUserUseCase.execute(id);

    const rentalsByUserDTO = rentalsByUser.map((rental) =>
      RentalMap.toDTO(rental)
    );

    return response.json(rentalsByUserDTO);
  }
}
