import { compare } from "bcrypt";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { ITokenProvider } from "@shared/container/providers/TokenProvider/ITokenProvider";

import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private readonly usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private readonly dateProvider: IDateProvider,
    @inject("TokenProvider")
    private readonly tokenProvider: ITokenProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    const { expires_refresh_token_days } = auth;

    if (!user) {
      throw new IncorrectEmailOrPasswordError();
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new IncorrectEmailOrPasswordError();
    }

    const token = this.tokenProvider.generateAccessToken(user.id);

    const refresh_token = this.tokenProvider.generateRefreshToken(
      user.id,
      email
    );

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_refresh_token_days
    );

    await this.usersTokensRepository.deleteByUser(user.id);

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_token_expires_date,
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refresh_token,
    };
  }
}
