import { Request, Response } from "express";
import { container } from "tsyringe";

import { IFile } from "@utils/file";

import { UploadCarImagesUseCase } from "./UploadCarImagesUseCase";

export class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const images = request.files as IFile[];

    const uploadCarImageUseCase = container.resolve(UploadCarImagesUseCase);

    const car = await uploadCarImageUseCase.execute({
      car_id: id,
      images,
    });

    return response.status(201).json(car);
  }
}
