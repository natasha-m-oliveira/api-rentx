import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { AppError } from "@shared/errors/AppError";
import { deleteFile } from "@utils/file";

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
export class UploadCarImagesUseCase {
  constructor(
    @inject("CarsRepository")
    private readonly carsRepository: ICarsRepository,
    @inject("CarsImagesRepository")
    private readonly carsImagesRepository: ICarsImagesRepository
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<Car> {
    const carExists = await this.carsRepository.findById(car_id, true);

    if (!carExists) {
      throw new AppError("Car does not exists!");
    }

    await this.carsImagesRepository.removeByCarId(car_id);

    if (carExists.images.length) {
      carExists.images.map(async (image) => {
        await deleteFile(`./tmp/cars/${image.image_name}`);
      });
    }

    const images = await Promise.all(
      images_name.map(async (image_name) => {
        return await this.carsImagesRepository.create({
          car_id,
          image_name,
        });
      })
    );

    carExists.images = images;

    return carExists;
  }
}
