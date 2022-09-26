import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { container } from "tsyringe";

import { IUsersRepository } from "../modules/accounts/repositories/IUsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error("Token missing");
  }

  // Bearer token
  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      "b417426cda0508f3d6e3f9eb619a4200"
    ) as IPayload;

    const usersRepository =
      container.resolve<IUsersRepository>("UsersRepository");

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new Error("User does not exists!");
    }
    next();
  } catch {
    throw new Error("Invalid token!");
  }
}
