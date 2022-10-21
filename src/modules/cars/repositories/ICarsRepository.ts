import { ICreateCarDTO } from "../dtos/ICreateCarDTO";
import { Car } from "../infra/typeorm/entities/Car";

export interface ICarsRepository {
  create: (data: ICreateCarDTO) => Promise<Car>;
  findByLicensePlate: (license_plate: string) => Promise<Car>;
  findAvailable: (
    brand_id?: string,
    category_id?: string,
    name?: string
  ) => Promise<Car[]>;
  findById: (id: string, details?: boolean) => Promise<Car>;
  updateAvailable: (id: string, available: boolean) => Promise<void>;
}
