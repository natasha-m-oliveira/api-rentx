import { Request, Response } from "express";

import { ListCategoriesUsecase } from "./ListCategoriesUseCase";

export class ListCategoriesController {
  constructor(private readonly listCategoriesUseCase: ListCategoriesUsecase) {}

  handle(request: Request, response: Response): Response {
    const all = this.listCategoriesUseCase.execute();

    return response.json(all);
  }
}
