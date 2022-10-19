import "reflect-metadata";
import { hash } from "bcrypt";

import { InMemoryUsersRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersRepository";
import { InMemoryUsersTokensRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersTokensRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { JWTTokenProvider } from "@shared/container/providers/TokenProvider/implementations/JWTTokenProvider";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let usersTokensRepository: InMemoryUsersTokensRepository;
let dateProvider: DayjsDateProvider;
let tokenProvider: JWTTokenProvider;

describe("Authenticate User", () => {
  beforeEach(() => {
    tokenProvider = new JWTTokenProvider();
    dateProvider = new DayjsDateProvider();
    usersRepository = new InMemoryUsersRepository();
    usersTokensRepository = new InMemoryUsersTokensRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      tokenProvider
    );
  });

  it("should be able to authenticate an user", async () => {
    const user = await usersRepository.create({
      name: "Belle Klein",
      password: await hash("248289", 8),
      email: "us@adasaki.aw",
      driver_license: "20882643635",
    });

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: "248289",
    });

    expect(result).toHaveProperty("access_token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "248289",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    const user = await usersRepository.create({
      name: "Ivan Ruiz",
      password: await hash("221824", 8),
      email: "uwakauca@nuwrala.na",
      driver_license: "25799833605",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
