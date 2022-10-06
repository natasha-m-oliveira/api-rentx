import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { ITokenProvider } from "@shared/container/providers/TokenProvider/ITokenProvider";
import { InvalidTokenError } from "@shared/errors/InvalidTokenError";
import { TokenExpiredError } from "@shared/errors/TokenExpiredError";
import { TokenMissingError } from "@shared/errors/TokenMissingError";

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;
  const tokenProvider = container.resolve<ITokenProvider>("TokenProvider");

  if (!authHeader) {
    throw new TokenMissingError();
  }

  // Bearer token
  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = tokenProvider.validateToken(
      token,
      auth.secret_token
    );

    request.user = {
      id: user_id,
    };

    next();
  } catch (error) {
    // Auto-Pilot
    if (error instanceof TokenExpiredError) {
      try {
        const usersTokensRepository = container.resolve<IUsersTokensRepository>(
          "UsersTokensRepository"
        );
        const dateProvider = container.resolve<IDateProvider>("DateProvider");

        const { sub: user_id } = tokenProvider.validateToken(
          token,
          auth.secret_token,
          {
            ignoreExpiration: true,
          }
        );

        const { refresh_token, id } =
          await usersTokensRepository.findLastTokenByUser(user_id);

        const { email } = tokenProvider.validateToken(
          refresh_token,
          auth.secret_refresh_token
        );

        await usersTokensRepository.deleteById(id);

        const new_token = tokenProvider.generateAccessToken(user_id);
        const new_refresh_token = tokenProvider.generateRefreshToken(
          user_id,
          email
        );

        const refresh_token_expires_date = dateProvider.addDays(
          auth.expires_refresh_token_days
        );

        await usersTokensRepository.create({
          user_id,
          refresh_token: new_refresh_token,
          expires_date: refresh_token_expires_date,
        });

        response.set("x-access-token", new_token);

        request.user = {
          id: user_id,
        };

        next();
      } catch {
        throw new InvalidTokenError();
      }
    } else {
      throw error;
    }
  }
}
