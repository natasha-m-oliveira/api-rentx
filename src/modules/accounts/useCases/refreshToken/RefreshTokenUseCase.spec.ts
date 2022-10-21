import { hash } from "bcrypt";

import { InMemoryUsersRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersRepository";
import { InMemoryUsersTokensRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersTokensRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { JWTTokenProvider } from "@shared/container/providers/TokenProvider/implementations/JWTTokenProvider";
import { InvalidTokenError } from "@shared/errors/InvalidTokenError";

import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

let refreshTokenUseCase: RefreshTokenUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let usersTokensRepository: InMemoryUsersTokensRepository;
let dateProvider: DayjsDateProvider;
let tokenProvider: JWTTokenProvider;
describe("Refresh Token", () => {
  beforeEach(() => {
    tokenProvider = new JWTTokenProvider();
    dateProvider = new DayjsDateProvider();
    usersTokensRepository = new InMemoryUsersTokensRepository();
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      tokenProvider
    );
    refreshTokenUseCase = new RefreshTokenUseCase(
      usersTokensRepository,
      dateProvider,
      tokenProvider
    );
  });

  it("should be able to refresh token", async () => {
    const user = await usersRepository.create({
      name: "Sallie Barrett",
      password: await hash("520055", 8),
      email: "palow@he.gn",
      driver_license: "18177518886",
    });

    const { refresh_token } = await authenticateUserUseCase.execute({
      email: user.email,
      password: "520055",
    });

    const token = await refreshTokenUseCase.execute(refresh_token);

    expect(token).toHaveProperty("access_token");
    expect(token).toHaveProperty("refresh_token");
  });

  it("should not be able to refresh token", async () => {
    await expect(
      refreshTokenUseCase.execute("invalid_token")
    ).rejects.toBeInstanceOf(InvalidTokenError);
  });
});
