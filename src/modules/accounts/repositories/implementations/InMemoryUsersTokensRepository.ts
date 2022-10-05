import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserToken } from "@modules/accounts/infra/typeorm/entities/UserToken";

import { IUsersTokensRepository } from "../IUsersTokensRepository";

export class InMemoryUsersTokensRepository implements IUsersTokensRepository {
  private usersTokens: UserToken[];

  constructor() {
    this.usersTokens = [];
  }

  async create({
    user_id,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      user_id,
      refresh_token,
      expires_date,
      created_at: new Date(),
    });
    this.usersTokens.push(userToken);

    return userToken;
  }

  async findByUserAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken> {
    const userToken = this.usersTokens.find(
      (userToken) =>
        userToken.user_id === user_id &&
        userToken.refresh_token === refresh_token
    );
    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    this.usersTokens = this.usersTokens.filter(
      (userToken) => userToken.id === id
    );
  }
}
