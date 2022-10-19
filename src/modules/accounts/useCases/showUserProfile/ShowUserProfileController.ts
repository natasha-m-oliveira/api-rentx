import { Request, Response } from "express";
import { container } from "tsyringe";

import { UserMap } from "@modules/accounts/mappers/UserMap";

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

export class ShowUserProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const profileUserUseCase = container.resolve(ShowUserProfileUseCase);

    const user = await profileUserUseCase.execute(id);

    const userDTO = UserMap.toDTO(user);

    return response.json(userDTO);
  }
}
