import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { ITokenProvider } from "@shared/container/providers/TokenProvider/ITokenProvider";
import { InvalidRefreshTokenError } from "@shared/errors/InvalidRefreshTokenError";

interface ITokenResponse {
  access_token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private readonly usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private readonly dateProvider: IDateProvider,
    @inject("TokenProvider")
    private readonly tokenProvider: ITokenProvider
  ) {}

  async execute(refresh_token: string): Promise<ITokenResponse> {
    const { email, sub: user_id } = this.tokenProvider.validateToken(
      refresh_token,
      auth.secret_refresh_token
    );

    const userToken =
      await this.usersTokensRepository.findByUserAndRefreshToken(
        user_id,
        refresh_token
      );

    if (!userToken) {
      throw new InvalidRefreshTokenError();
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const new_refresh_token = this.tokenProvider.generateRefreshToken(
      user_id,
      email
    );

    const refresh_token_expires_date = this.dateProvider.addDays(
      auth.expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      user_id,
      refresh_token: new_refresh_token,
      expires_date: refresh_token_expires_date,
    });

    const new_access_token = this.tokenProvider.generateAccessToken(user_id);

    return {
      refresh_token: new_refresh_token,
      access_token: new_access_token,
    };
  }
}
