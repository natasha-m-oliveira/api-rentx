import { Request, Response } from "express";
import { container } from "tsyringe";

import { UploadCarImagesUseCase } from "./UploadCarImagesUseCase";

interface IFile {
  filename: string;
}

export class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const images = request.files as IFile[];
    const images_name = images.map((file) => file.filename);

    const uploadCarImageUseCase = container.resolve(UploadCarImagesUseCase);

    const car = await uploadCarImageUseCase.execute({
      car_id: id,
      images_name,
    });

    return response.status(201).json(car);
  }
}
