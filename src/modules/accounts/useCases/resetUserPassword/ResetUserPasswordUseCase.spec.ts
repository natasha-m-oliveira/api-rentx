import { compare } from "bcrypt";

import { InMemoryUsersRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersRepository";
import { InMemoryUsersTokensRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersTokensRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { InvalidTokenError } from "@shared/errors/InvalidTokenError";
import { TokenExpiredError } from "@shared/errors/TokenExpiredError";

import { ResetUserPasswordUseCase } from "./ResetUserPasswordUseCase";

let usersTokensRepository: InMemoryUsersTokensRepository;
let usersRepository: InMemoryUsersRepository;
let dateProvider: DayjsDateProvider;
let resetPasswordUserUseCase: ResetUserPasswordUseCase;
describe("Reset Password User", () => {
  beforeEach(() => {
    usersTokensRepository = new InMemoryUsersTokensRepository();
    usersRepository = new InMemoryUsersRepository();
    dateProvider = new DayjsDateProvider();
    resetPasswordUserUseCase = new ResetUserPasswordUseCase(
      usersTokensRepository,
      dateProvider,
      usersRepository
    );
  });

  it("should be able to reset user password", async () => {
    const user = await usersRepository.create({
      name: "Gerald Hopkins",
      password: "041334",
      email: "ajwi@polel.bi",
      driver_license: "65346293090",
    });

    const userToken = await usersTokensRepository.create({
      user_id: user.id,
      refresh_token: "U4QeW9Fx1LpnVI6VWIyKIWrP",
      expires_date: dateProvider.addHours(1),
    });

    const result = await resetPasswordUserUseCase.execute({
      token: userToken.refresh_token,
      password: "208307",
    });

    const passwordMatch = await compare("208307", result.password);

    expect(result).toHaveProperty("email");
    expect(result.email).toEqual(user.email);
    expect(passwordMatch).toBeTruthy();
  });

  it("it should not be able to reset user password with invalid token", async () => {
    await expect(
      resetPasswordUserUseCase.execute({
        token: "invalid_token",
        password: "208307",
      })
    ).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it("it should not be able to reset user password with expired token", async () => {
    const user = await usersRepository.create({
      name: "Ola Leonard",
      password: "827527",
      email: "dahu@zigaw.va",
      driver_license: "55098130565",
    });

    const userToken = await usersTokensRepository.create({
      user_id: user.id,
      refresh_token: "UkKHFU5a6NuVK1WhNYDoRTlZ",
      expires_date: dateProvider.subtractHours(1),
    });

    await expect(
      resetPasswordUserUseCase.execute({
        token: userToken.refresh_token,
        password: "208307",
      })
    ).rejects.toBeInstanceOf(TokenExpiredError);
  });
});
