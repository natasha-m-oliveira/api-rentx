import { Request, Response } from "express";
import { container } from "tsyringe";

import { UserMap } from "@modules/accounts/mapper/UserMap";

import { ProfileUserUseCase } from "./ProfileUserUseCase";

export class ProfileUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const profileUserUseCase = container.resolve(ProfileUserUseCase);

    const user = await profileUserUseCase.execute(id);

    const userDTO = UserMap.toDTO(user);

    return response.json(userDTO);
  }
}
