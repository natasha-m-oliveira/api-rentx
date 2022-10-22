import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";

import { UploadCarImagesError } from "./UploadCarImagesError";

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
    private readonly carsImagesRepository: ICarsImagesRepository,
    @inject("StorageProvider")
    private readonly storageProvider: IStorageProvider
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<Car> {
    const carExists = await this.carsRepository.findById(car_id, true);

    if (!carExists) {
      throw new UploadCarImagesError();
    }

    await this.carsImagesRepository.removeByCar(car_id);

    if (carExists.images.length) {
      carExists.images.map(async (image) => {
        await this.storageProvider.delete(image.image_name, "cars");
      });
    }

    const images = await Promise.all(
      images_name.map(async (image_name) => {
        await this.storageProvider.save(image_name, "cars");
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
