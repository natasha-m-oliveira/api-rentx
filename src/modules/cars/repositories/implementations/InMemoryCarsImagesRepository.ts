import { ICreateCarImageDTO } from "@modules/cars/dtos/ICreateCarImageDTO";
import { CarImage } from "@modules/cars/infra/typeorm/entities/CarImage";

import { ICarsImagesRepository } from "../ICarsImagesRepository";

export class InMemoryCarsImagesRepository implements ICarsImagesRepository {
  private carsImages: CarImage[];

  constructor() {
    this.carsImages = [];
  }

  async create({ car_id, image_name }: ICreateCarImageDTO): Promise<CarImage> {
    const carImage = new CarImage();

    Object.assign(carImage, {
      car_id,
      image_name,
      created_at: new Date(),
    });

    this.carsImages.push(carImage);

    return carImage;
  }

  async removeByCar(car_id: string): Promise<void> {
    const all = this.carsImages.filter(
      (carImage) => carImage.car_id !== car_id
    );
    this.carsImages = all;
  }
}
