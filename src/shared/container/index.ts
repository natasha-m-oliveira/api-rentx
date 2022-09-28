import { container } from "tsyringe";

import { PostgresUserRepository } from "@modules/accounts/repositories/implementations/PostgresUsersRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";
import { PostgresCategoriesRepository } from "@modules/cars/repositories/implementations/PostgresCategoriesRepository";
import { PostgresSpecificationsRepository } from "@modules/cars/repositories/implementations/PostgresSpecificationsRepository";
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
