import {
  sign,
  TokenExpiredError as JWTTokenExpiredError,
  verify,
} from "jsonwebtoken";

import auth from "@config/auth";
import { InvalidTokenError } from "@shared/errors/InvalidTokenError";
import { TokenExpiredError } from "@shared/errors/TokenExpiredError";

import { IOptions, IPayload, ITokenProvider } from "../ITokenProvider";

export class JWTTokenProvider implements ITokenProvider {
  generateAccessToken(user_id: string): string {
    const token = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token,
    });
    return token;
  }

  generateRefreshToken(user_id: string, email: string): string {
    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.expires_in_refresh_token,
    });
    return refresh_token;
  }

  validateToken(token: string, secret: string, options?: IOptions): IPayload {
    try {
      const payload = verify(token, secret, options) as IPayload;
      return payload;
    } catch (error) {
      if (error instanceof JWTTokenExpiredError) {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError();
    }
  }
}
