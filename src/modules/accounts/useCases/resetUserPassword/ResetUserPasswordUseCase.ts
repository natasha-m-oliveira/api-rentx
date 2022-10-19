import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { InvalidTokenError } from "@shared/errors/InvalidTokenError";
import { TokenExpiredError } from "@shared/errors/TokenExpiredError";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export class ResetUserPasswordUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private readonly usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private readonly dateProvider: IDateProvider,
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute({ token, password }: IRequest): Promise<User> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (!userToken) {
      throw new InvalidTokenError();
    }

    if (
      this.dateProvider.compareIfBefore(
        userToken.expires_date,
        this.dateProvider.dateNow()
      )
    ) {
      throw new TokenExpiredError();
    }

    await this.usersTokensRepository.deleteById(userToken.id);
    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new InvalidTokenError();
    }

    user.password = await hash(password, 8);
    await this.usersRepository.create(user);

    return user;
  }
}
