import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListCategoriesUsecase } from "./ListCategoriesUseCase";

export class ListCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listCategoriesUseCase = container.resolve(ListCategoriesUsecase);

    const all = await listCategoriesUseCase.execute();

    return response.json(all);
  }
}
