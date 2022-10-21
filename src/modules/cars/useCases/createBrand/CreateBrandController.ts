import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateBrandUseCase } from "./CreateBrandUseCase";

export class CreateBrandController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createBrandUseCase = container.resolve(CreateBrandUseCase);

    const category = await createBrandUseCase.execute({ name });

    return response.status(201).json(category);
  }
}
