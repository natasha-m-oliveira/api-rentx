import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { id } = request.user;

  const usersRepository =
    container.resolve<IUsersRepository>("UsersRepository");
  const user = await usersRepository.findById(id);

  if (!user.is_admin) {
    throw new AppError("User isn't admin!");
  }

  return next();
}
