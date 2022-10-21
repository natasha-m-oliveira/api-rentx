import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListBrandsUseCase } from "./ListBrandsUseCase";

export class ListBrandsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listBrandsUseCase = container.resolve(ListBrandsUseCase);

    const all = await listBrandsUseCase.execute();

    return response.json(all);
  }
}
