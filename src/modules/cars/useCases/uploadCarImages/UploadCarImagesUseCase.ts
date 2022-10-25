import fs from "fs";
import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { FileType, IFile, validate } from "@utils/file";

import { UploadCarImagesError } from "./UploadCarImagesError";

interface IRequest {
  car_id: string;
  images: IFile[];
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

  async execute({ car_id, images }: IRequest): Promise<Car> {
    try {
      const invalidFiles = images.filter(
        (image) => !validate({ file: image, type: FileType.IMAGE })
      );

      if (invalidFiles.length) {
        throw new UploadCarImagesError.InvalidFileFormat();
      }

      const carExists = await this.carsRepository.findById(car_id, true);

      if (!carExists) {
        throw new UploadCarImagesError.CarNotFound();
      }

      await this.carsImagesRepository.removeByCar(car_id);

      if (carExists.images.length) {
        carExists.images.map(async (image) => {
          await this.storageProvider.delete(image.image_name, "cars");
        });
      }

      const carImages = await Promise.all(
        images.map(async (image) => {
          await this.storageProvider.save(image.filename, "cars");
          return await this.carsImagesRepository.create({
            car_id,
            image_name: image.filename,
          });
        })
      );

      carExists.images = carImages;

      return carExists;
    } catch (error) {
      await Promise.all(
        images.map(async (image) => {
          await fs.promises.unlink(image.path);
        })
      );
      throw error;
    }
  }
}
