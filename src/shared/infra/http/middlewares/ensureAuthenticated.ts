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
  const [, access_token] = authHeader.split(" ");
  const refresh_token = request.headers["x-refresh-token"];

  try {
    const { sub: user_id } = tokenProvider.validateToken(
      access_token,
      auth.secret_access_token
    );

    request.user = {
      id: user_id,
    };

    next();
  } catch (error) {
    // Auto Pilot
    if (error instanceof TokenExpiredError && refresh_token) {
      const usersTokensRepository = container.resolve<IUsersTokensRepository>(
        "UsersTokensRepository"
      );
      const dateProvider = container.resolve<IDateProvider>("DateProvider");

      const userToken = await usersTokensRepository.findByRefreshToken(
        refresh_token as string
      );

      if (!userToken) {
        throw new InvalidTokenError();
      }

      const { email } = tokenProvider.validateToken(
        refresh_token as string,
        auth.secret_refresh_token
      );

      await usersTokensRepository.deleteById(userToken.id);

      const new_access_token = tokenProvider.generateAccessToken(
        userToken.user_id
      );
      const new_refresh_token = tokenProvider.generateRefreshToken(
        userToken.user_id,
        email
      );

      const refresh_token_expires_date = dateProvider.addDays(
        auth.expires_refresh_token_days
      );

      await usersTokensRepository.create({
        user_id: userToken.user_id,
        refresh_token: new_refresh_token,
        expires_date: refresh_token_expires_date,
      });

      response.set("x-access-token", new_access_token);
      response.set("x-refresh-token", new_refresh_token);

      request.user = {
        id: userToken.user_id,
      };

      next();
    } else {
      throw error;
    }
  }
}
