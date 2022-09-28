import { container } from "tsyringe";

import { PostgresUserRepository } from "@modules/accounts/infra/typeorm/repositories/PostgresUsersRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { PostgresCarsRepository } from "@modules/cars/infra/typeorm/repositories/PostgresCarsRepository";
import { PostgresCategoriesRepository } from "@modules/cars/infra/typeorm/repositories/PostgresCategoriesRepository";
import { PostgresSpecificationsRepository } from "@modules/cars/infra/typeorm/repositories/PostgresSpecificationsRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";

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
