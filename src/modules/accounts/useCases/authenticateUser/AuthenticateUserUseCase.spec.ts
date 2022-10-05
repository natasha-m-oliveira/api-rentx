import { container } from "tsyringe";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { InMemoryUsersRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersRepository";
import { InMemoryUsersTokensRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { ITokenProvider } from "@shared/container/providers/TokenProvider/ITokenProvider";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let usersTokensRepository: InMemoryUsersTokensRepository;
let dateProvider: IDateProvider;
let tokenProvider: ITokenProvider;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    usersTokensRepository = new InMemoryUsersTokensRepository();
    dateProvider = container.resolve<IDateProvider>("DateProvider");
    tokenProvider = container.resolve<ITokenProvider>("TokenProvider");
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      tokenProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      password: "1234",
      email: "john.doe@test.com",
      driver_license: "000123",
    };

    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "incorrectPassword",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      password: "1234",
      email: "john.doe@test.com",
      driver_license: "000123",
    };

    await createUserUseCase.execute(user);
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
