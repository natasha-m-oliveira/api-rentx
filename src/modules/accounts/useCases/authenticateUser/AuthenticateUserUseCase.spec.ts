import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { InMemoryUsersRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
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

  it("should not be able to authenticate an nonexistent user", () => {
    void expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "incorrectPassword",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate an nonexistent user", () => {
    void expect(async () => {
      const user: ICreateUserDTO = {
        name: "John Doe",
        password: "1234",
        email: "john.doe@test.com",
        driver_license: "000123",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      });
    });
  });
});
