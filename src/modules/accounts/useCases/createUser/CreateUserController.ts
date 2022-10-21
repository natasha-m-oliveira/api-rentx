import { Request, Response } from "express";
import { container } from "tsyringe";

import { UserMap } from "@modules/accounts/mappers/UserMap";

import { CreateUserUseCase } from "./CreateUserUseCase";

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, driver_license } = request.body;
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({
      name,
      email,
      password,
      driver_license,
    });

    const userDTO = UserMap.toDTO(user);

    return response.status(201).json(userDTO);
  }
}
