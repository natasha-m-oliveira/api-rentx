import { container } from "tsyringe";

import "@shared/container/providers";

import { PostgresUserRepository } from "@modules/accounts/infra/typeorm/repositories/PostgresUsersRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { PostgresCarsImagesRepository } from "@modules/cars/infra/typeorm/repositories/PostgresCarsImagesRepository";
import { PostgresCarsRepository } from "@modules/cars/infra/typeorm/repositories/PostgresCarsRepository";
import { PostgresCategoriesRepository } from "@modules/cars/infra/typeorm/repositories/PostgresCategoriesRepository";
import { PostgresSpecificationsRepository } from "@modules/cars/infra/typeorm/repositories/PostgresSpecificationsRepository";
import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { PostgresRentalsRepository } from "@modules/rentals/infra/typeorm/repositories/PostgresRentalsRepository";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

// ICategoriesRepository
// singleton -> é um padrão garante a existência de apenas uma instância de uma classe,
// mantendo um ponto global de acesso ao seu objeto
container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  PostgresCategoriesRepository
);

container.registerSingleton<ISpecificationsRepository>(
  "SpecificationsRepository",
  PostgresSpecificationsRepository
);

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  PostgresUserRepository
);

container.registerSingleton<ICarsRepository>(
  "CarsRepository",
  PostgresCarsRepository
);

container.registerSingleton<ICarsImagesRepository>(
  "CarsImagesRepository",
  PostgresCarsImagesRepository
);

container.registerSingleton<IRentalsRepository>(
  "RentalsRepository",
  PostgresRentalsRepository
);
