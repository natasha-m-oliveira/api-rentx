import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider.ts/IDateProvider";
import { JWTInvalidRefreshTokenError } from "@shared/errors/JWTInvalidRefreshTokenError";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private readonly usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private readonly dateProvider: IDateProvider
  ) {}

  async execute(refresh_token: string): Promise<ITokenResponse> {
    const { email, sub: user_id } = verify(
      refresh_token,
      auth.secret_refresh_token
    ) as IPayload;

    const {
      secret_token,
      expires_in_token,
      secret_refresh_token,
      expires_in_refresh_token,
      expires_refresh_token_days,
    } = auth;

    const userToken =
      await this.usersTokensRepository.findByUserAndRefreshToken(
        user_id,
        refresh_token
      );

    if (!userToken) {
      throw new JWTInvalidRefreshTokenError();
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const new_refresh_token = sign({ email }, secret_refresh_token, {
      subject: user_id,
      expiresIn: expires_in_refresh_token,
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      user_id,
      refresh_token: new_refresh_token,
      expires_date: refresh_token_expires_date,
    });

    const new_token = sign({}, secret_token, {
      subject: user_id,
      expiresIn: expires_in_token,
    });

    return {
      refresh_token: new_refresh_token,
      token: new_token,
    };
  }
}
